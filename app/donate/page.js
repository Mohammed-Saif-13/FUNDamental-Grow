'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SuccessModal from '@/components/ui/SuccessModal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { DONATION_AMOUNTS, DUMMY_CAMPAIGNS, API_ROUTES, VALIDATION, MESSAGES, ROUTES } from '@/lib/constants';

export default function DonatePage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    amount: '',
    customAmount: '',
    campaign: '',
    message: '',
    fullName: '',
    email: '',
    phone: '',
    anonymous: false,
    termsAccepted: false,
  });
  
  const campaigns = DUMMY_CAMPAIGNS;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (session) {
      setFormData(prev => ({
        ...prev,
        fullName: session.user.name || '',
        email: session.user.email || '',
      }));
    }
  }, [session]);

  const handleAmountSelect = (value) => {
    setFormData({ ...formData, amount: value, customAmount: '' });
  };

  const handleCustomAmount = (e) => {
    setFormData({ ...formData, amount: 'custom', customAmount: e.target.value });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const validateForm = () => {
    const donationAmount = formData.amount === 'custom' 
      ? parseInt(formData.customAmount) 
      : formData.amount;

    if (!donationAmount || donationAmount < VALIDATION.minDonationAmount) {
      setError(`Minimum donation amount is ₹${VALIDATION.minDonationAmount}`);
      return false;
    }

    if (!formData.termsAccepted) {
      setError(MESSAGES.termsError);
      return false;
    }

    if (!formData.fullName || !formData.email || !formData.phone || !formData.campaign || !formData.message) {
      setError('Please fill all required fields');
      return false;
    }

    return true;
  };

  const saveDonation = async (paymentId, status, donationAmount) => {
    try {
      const res = await fetch(API_ROUTES.donations, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign: formData.campaign,
          amount: donationAmount,
          donor: session?.user?.id || null,
          fullName: formData.anonymous ? 'Anonymous' : formData.fullName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          paymentMethod: 'razorpay',
          paymentId: paymentId,
          status: status,
          anonymous: formData.anonymous,
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setShowSuccess(true);
        setFormData({
          amount: '',
          customAmount: '',
          campaign: '',
          message: '',
          fullName: session?.user?.name || '',
          email: session?.user?.email || '',
          phone: '',
          anonymous: false,
          termsAccepted: false,
        });
      } else {
        throw new Error(data.message || 'Failed to save donation');
      }
    } catch (err) {
      console.error('Error saving donation:', err);
      alert('Payment successful but failed to save record. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async (donationAmount) => {
    setLoading(true);
    setTimeout(async () => {
      const paymentId = 'TEST_' + Date.now();
      await saveDonation(paymentId, 'completed', donationAmount);
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    const donationAmount = formData.amount === 'custom' 
      ? parseInt(formData.customAmount) 
      : formData.amount;

    try {
      await handleRazorpayPayment(donationAmount);
    } catch (err) {
      console.error('Submit error:', err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push(ROUTES.campaigns);
  };

  const selectedAmount = formData.amount === 'custom' 
    ? formData.customAmount 
    : formData.amount;

  return (
    <>
      <SuccessModal
        show={showSuccess}
        onClose={handleSuccessClose}
        title="Donation Successful!"
        message={MESSAGES.donationSuccess}
      />

      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="donation-container relative bg-white rounded-3xl shadow-2xl overflow-hidden 
                        transition-all duration-600 hover:shadow-3xl hover:-translate-y-1">
            
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF5528] to-[#FF8C66] z-10"></div>

            <div className="absolute top-[-100px] right-[-100px] w-[250px] h-[250px] rounded-full 
                          bg-gradient-to-br from-[#FF552833] to-transparent opacity-30 
                          transition-all duration-800 donation-circle-1"></div>
            <div className="absolute bottom-[-80px] left-[-80px] w-[200px] h-[200px] rounded-full 
                          bg-gradient-to-br from-[#FF552833] to-transparent opacity-20 
                          transition-all duration-800 donation-circle-2"></div>

            <div className="text-center pt-9 pb-6 relative overflow-hidden">
              <h1 className="text-4xl font-bold text-[#2c3e50] font-serif inline-block relative 
                           after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 
                           after:-translate-x-1/2 after:w-10 after:h-[3px] after:bg-gradient-to-r 
                           after:from-[#FF5528] after:to-[#FF8C66] after:rounded-full 
                           after:transition-all after:duration-500 donation-heading">
                Make a Donation!
              </h1>
              <p className="text-sm text-[#7F8C8D] mt-3">Every contribution makes a difference</p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 md:px-10 pb-10">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Section 1: Amount */}
              <div className="donation-section p-6 border-b border-[#ecf0f1] hover:bg-[#ECF0F133] transition-all">
                <div className="donation-section-title flex items-center text-lg font-semibold text-[#FF5528] mb-5">
                  <span className="w-2 h-2 bg-[#FF5528] rounded-full mr-3 animate-pulse"></span>
                  Donation Amount
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-[#7F8C8D] mb-3 font-medium">
                    Select Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    {DONATION_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleAmountSelect(amt)}
                        className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300
                          ${formData.amount === amt 
                            ? 'bg-[#FF5528] text-white shadow-lg scale-105' 
                            : 'bg-[#ECF0F1] text-[#2c3e50] hover:bg-[#FF552833] hover:scale-105'
                          }`}
                      >
                        ₹{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    name="customAmount"
                    value={formData.customAmount}
                    onChange={handleCustomAmount}
                    placeholder={`Or enter custom amount (min ₹${VALIDATION.minDonationAmount})`}
                    className="w-full px-5 py-4 border-2 border-[#ecf0f1] rounded-xl text-[15px] 
                             text-[#2c3e50] bg-[#ECF0F133] transition-all duration-300
                             focus:border-[#FF5528] focus:shadow-[0_0_0_4px_rgba(255,85,40,0.1)] 
                             focus:bg-white outline-none placeholder:text-[#bdc3c7]"
                  />
                </div>

                <Select
                  label="Select Campaign"
                  name="campaign"
                  required
                  value={formData.campaign}
                  onChange={handleChange}
                  placeholder="Select a campaign"
                  options={campaigns.map(c => ({ value: c._id, label: c.title }))}
                />

                <Textarea
                  label="Add a Message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Share why you're donating..."
                />
              </div>

              {/* Section 2: Your Details */}
              <div className="donation-section p-6 border-b border-[#ecf0f1] hover:bg-[#ECF0F133] transition-all">
                <div className="donation-section-title flex items-center text-lg font-semibold text-[#FF5528] mb-5">
                  <span className="w-2 h-2 bg-[#FF5528] rounded-full mr-3 animate-pulse"></span>
                  Your Details
                </div>

                <Input
                  label="Full Name"
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 1234567890"
                />
              </div>

              {/* Section 3: Options */}
              <div className="donation-section p-6 border-b border-[#ecf0f1] hover:bg-[#ECF0F133] transition-all">
                <div className="donation-section-title flex items-center text-lg font-semibold text-[#FF5528] mb-5">
                  <span className="w-2 h-2 bg-[#FF5528] rounded-full mr-3 animate-pulse"></span>
                  Options
                </div>

                <div className="mb-4">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      name="anonymous"
                      checked={formData.anonymous}
                      onChange={handleChange}
                      className="w-5 h-5 mr-3 accent-[#FF5528] cursor-pointer"
                    />
                    <span className="text-sm text-[#7F8C8D] group-hover:text-[#2c3e50] transition-colors">
                      Donate Anonymously (Your name will be hidden)
                    </span>
                  </label>
                </div>

                <div className="mb-4">
                  <label className="flex items-start cursor-pointer group">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      className="w-5 h-5 mt-0.5 mr-3 accent-[#FF5528] cursor-pointer"
                    />
                    <span className="text-sm text-[#7F8C8D] leading-relaxed">
                      I agree to the{' '}
                      <Link href="/terms" className="text-[#FF5528] hover:underline">
                        Terms & Conditions
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-[#FF5528] hover:underline">
                        Privacy Policy
                      </Link>
                      <span className="text-red-500 ml-1">*</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="p-6">
                <Button type="submit" loading={loading} disabled={!selectedAmount}>
                  Donate {selectedAmount ? `₹${parseInt(selectedAmount).toLocaleString()}` : 'Now'}
                </Button>

                <div className="text-center mt-4">
                  <Link href={ROUTES.home} className="text-sm text-[#7F8C8D] hover:text-[#FF5528] transition-colors">
                    ← Back to Home
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}