import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, Clock, FileText, UserCircle } from 'lucide-react';
import Sidebar from '../../../components/common/Sidebar';
import Topbar from '../../../components/common/Topbar';
import Button from '../../../components/common/Button';
import api from '../../../api/axios';
import Loader from '../../../components/common/Loader';

const ClientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await api.get(`/clients/${id}`);
        if (res.data.success) {
          setClient(res.data.client);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  if (loading) return (
    <div className="flex-1 flex justify-center items-center h-[50vh]"><Loader /></div>
  );

  if (!client) return <div>Client not found</div>;

  return (
  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Nav */}
            <div>
              <Link to="/clients" className="inline-flex items-center gap-2 text-sm text-slate hover:text-ink transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back to Clients
              </Link>
            </div>

            {/* Profile Header */}
            <div className="bg-bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8">
              <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
                    <UserCircle className="w-10 h-10" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-ink">{client.name}</h1>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize
                        ${client.status === 'active' ? 'bg-sage/20 text-sage' : 'bg-slate/10 text-slate'}`}
                      >
                        {client.status}
                      </span>
                      <span className="text-sm text-slate flex items-center gap-1">
                        <Mail className="w-4 h-4" /> {client.email}
                      </span>
                      {client.phone && (
                        <span className="text-sm text-slate flex items-center gap-1">
                          <Phone className="w-4 h-4" /> {client.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" icon={FileText}>Notes</Button>
                  <Button variant="primary" icon={Calendar}>Book Session</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Col - Details */}
              <div className="space-y-6">
                <div className="bg-bg-card border border-border rounded-xl shadow-sm p-6">
                  <h3 className="font-bold text-ink mb-4">Client Details</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="block text-slate text-xs mb-1">Date of Birth</span>
                      <span className="font-semibold text-ink">
                        {client.dateOfBirth ? new Date(client.dateOfBirth).toLocaleDateString() : 'Not provided'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate text-xs mb-1">Client Since</span>
                      <span className="font-semibold text-ink">{new Date(client.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="block text-slate text-xs mb-1">Tags</span>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {client.tags?.length > 0 ? client.tags.map(tag => (
                          <span key={tag} className="bg-bg-main border border-border px-2 py-0.5 rounded text-xs text-slate">{tag}</span>
                        )) : <span className="text-slate italic">No tags</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-bg-card border border-border rounded-xl shadow-sm p-6">
                  <h3 className="font-bold text-ink mb-4 flex items-center justify-between">
                    Intake & Consent
                    <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-700 rounded-md">Pending</span>
                  </h3>
                  <p className="text-sm text-slate mb-4">Intake forms and consent documents have not been completed yet.</p>
                  <Button variant="outline" size="sm" className="w-full justify-center">Send Intake Packet</Button>
                </div>
              </div>

              {/* Right Col - Activity/Sessions */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-bg-card border border-border rounded-xl shadow-sm p-6 min-h-[400px]">
                  <h3 className="font-bold text-ink mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Session History
                  </h3>
                  
                  <div className="flex flex-col items-center justify-center text-center h-48 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-bg-main flex items-center justify-center text-slate">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-ink">No sessions yet</p>
                      <p className="text-sm text-slate">This client hasn't had any sessions.</p>
                    </div>
                    <Button variant="outline" size="sm">Schedule first session</Button>
                  </div>
                </div>
              </div>

            </div>
      </div>
    </>
  );
};

export default ClientProfile;
