import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import { getClientIntake, updateClientIntake } from '../../api/clientApi';
import Toast from '../common/Toast';

const FIELDS = [
  'fullName',
  'dateOfBirth',
  'pronouns',
  'phone',
  'email',
  'emergencyContact',
  'presentingConcern',
  'medicalHistory',
  'medications',
  'previousTherapy',
  'goals',
  'communicationMethod',
];

const inputClass = 'w-full px-4 py-2 bg-white border border-border rounded-lg focus:ring-2 focus:ring-primary/20';

const IntakeForm = ({ clientId, consentAccepted = false, onSaved }) => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchIntake = async () => {
      try {
        const res = await getClientIntake(clientId);
        if (res.success && res.data) {
          const data = { ...res.data };
          if (data.dateOfBirth) {
            data.dateOfBirth = String(data.dateOfBirth).slice(0, 10);
          }
          reset(data);
        }
      } catch (err) {
        console.error('Error fetching intake data', err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchIntake();
  }, [clientId, reset]);

  const save = async (data, complete) => {
    setLoading(true);
    try {
      const res = await updateClientIntake(clientId, {
        ...data,
        status: complete ? 'complete' : 'draft',
      });
      if (res.success) {
        setToast({
          message: complete ? 'Intake completed.' : 'Draft saved.',
          type: 'success',
        });
        onSaved?.();
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to save intake form',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const values = watch();
  const filledFields = FIELDS.filter((field) => values[field] && String(values[field]).trim() !== '').length;
  const completionPercentage = Math.round((filledFields / FIELDS.length) * 100);

  if (initialLoading) {
    return <div className="p-8 text-center text-slate">Loading intake form...</div>;
  }

  return (
    <div className="bg-bg-card border border-border rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-bold text-ink">Client Intake Form</h2>
          <p className="text-sm text-slate">Sensitive clinical data · therapist only</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-slate">
            Completion: <span className={completionPercentage === 100 ? 'text-sage' : 'text-primary'}>{completionPercentage}%</span>
          </div>
          {completionPercentage === 100 && <CheckCircle className="w-5 h-5 text-sage" />}
        </div>
      </div>

      <form className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-ink border-b border-border pb-2">Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate mb-1">Full name</label>
              <input {...register('fullName', { required: true })} className={inputClass} />
              {errors.fullName && <p className="text-xs text-error mt-1">Required</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate mb-1">Date of birth</label>
              <input type="date" {...register('dateOfBirth', { required: true })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate mb-1">Pronouns</label>
              <input {...register('pronouns')} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate mb-1">Phone</label>
              <input {...register('phone')} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate mb-1">Email</label>
              <input type="email" {...register('email', { required: true })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate mb-1">Preferred communication</label>
              <select {...register('communicationMethod')} className={inputClass}>
                <option value="">Select method...</option>
                <option value="Email">Email</option>
                <option value="Phone Call">Phone Call</option>
                <option value="SMS">SMS Message</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-ink border-b border-border pb-2 flex justify-between">
            <span>Clinical information</span>
            <span className="text-xs text-error font-normal bg-error-bg px-2 py-0.5 rounded border border-error/20">Therapist only · sensitive</span>
          </h3>
          <div>
            <label className="block text-sm font-semibold text-slate mb-1">Emergency contact</label>
            <input {...register('emergencyContact')} className={inputClass} placeholder="Name and phone number" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate mb-1">Presenting concern</label>
            <textarea {...register('presentingConcern')} rows="3" className={inputClass} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate mb-1">Relevant medical / mental-health history</label>
              <textarea {...register('medicalHistory')} rows="3" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate mb-1">Current medications</label>
              <textarea {...register('medications')} rows="3" className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate mb-1">Previous therapy experience</label>
            <textarea {...register('previousTherapy')} rows="2" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate mb-1">Goals for therapy</label>
            <textarea {...register('goals')} rows="3" className={inputClass} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="secondary" icon={Save} disabled={loading} onClick={handleSubmit((data) => save(data, false))}>
            Save Draft
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={loading}
            onClick={handleSubmit((data) => {
              if (!consentAccepted) {
                setToast({ message: 'Consent must be accepted before intake can be completed.', type: 'error' });
                return;
              }
              save(data, true);
            })}
          >
            Save / Complete
          </Button>
        </div>
      </form>
    </div>
  );
};

export default IntakeForm;
