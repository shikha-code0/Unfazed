import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ShieldCheck, CheckSquare, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import { getClientConsent, createClientConsent } from '../../api/clientApi';
import Toast from '../common/Toast';

const CONSENT_VERSION = '1.0';
const CONSENT_TEXT =
  'I understand the nature of therapy, confidentiality boundaries, cancellation policy, and how my information will be handled.';

const ConsentForm = ({ clientId, clientName = '', onSaved }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [consentRecord, setConsentRecord] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchConsent = async () => {
      try {
        const res = await getClientConsent(clientId);
        if (res.success && res.data && res.data.accepted) {
          setConsentRecord(res.data);
        }
      } catch (err) {
        console.error('Error fetching consent data', err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchConsent();
  }, [clientId]);

  const onSubmit = async (data) => {
    if (consentRecord) return;
    setLoading(true);
    try {
      const res = await createClientConsent(clientId, {
        consentVersion: CONSENT_VERSION,
        accepted: true,
        signature: data.signature,
      });
      if (res.success) {
        setConsentRecord(res.data);
        setToast({ message: 'Consent recorded.', type: 'success' });
        onSaved?.();
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to record consent',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="p-8 text-center text-slate">Loading consent data...</div>;
  }

  return (
    <div className="bg-bg-card border border-border rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">Informed Consent for Therapy</h2>
            <p className="text-sm text-slate">Version {CONSENT_VERSION}</p>
          </div>
        </div>
        {consentRecord ? (
          <span className="px-3 py-1 bg-sage/20 text-sage rounded-full text-xs font-bold flex items-center gap-1">
            <CheckSquare className="w-4 h-4" /> Consented
          </span>
        ) : (
          <span className="px-3 py-1 bg-warning-bg text-warning rounded-full text-xs font-bold flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> Pending
          </span>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-bg-main p-4 rounded-lg border border-border text-sm text-slate leading-relaxed">
          <p>{CONSENT_TEXT}</p>
        </div>

        {consentRecord ? (
          <div className="bg-sage/10 border border-sage/30 rounded-lg p-4 flex items-center gap-3 text-sage">
            <ShieldCheck className="w-6 h-6 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Consent completed on {new Date(consentRecord.acceptedAt).toLocaleString()}</p>
              <p className="text-xs opacity-80">Version {consentRecord.consentVersion}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agree"
                {...register('agree', { required: 'Consent checkbox is required' })}
                className="mt-1 w-4 h-4 text-primary focus:ring-primary border-slate rounded"
              />
              <label htmlFor="agree" className="text-sm text-slate">{CONSENT_TEXT}</label>
            </div>
            {errors.agree && <p className="text-xs text-error">{errors.agree.message}</p>}

            <div className="max-w-md">
              <label className="block text-sm font-semibold text-slate mb-1">Type full name to confirm ({clientName})</label>
              <input
                type="text"
                {...register('signature', {
                  required: 'Full name confirmation is required',
                  validate: (value) =>
                    value.trim().toLowerCase() === clientName.trim().toLowerCase() || 'Name must match the client record',
                })}
                placeholder="Full name"
                className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:ring-2 focus:ring-primary/20"
              />
              {errors.signature && <p className="text-xs text-error mt-1">{errors.signature.message}</p>}
            </div>

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Sign & Submit Consent'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ConsentForm;
