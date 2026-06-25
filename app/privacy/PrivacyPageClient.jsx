"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPageClient = () => {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-bg-dark text-on-surface font-body hero-grid flex flex-col items-center justify-start pt-20 pb-16 px-6 selection:bg-accent-yellow selection:text-bg-dark relative overflow-hidden">
      {/* Glow Blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-navy/10 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-accent-yellow/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-3xl w-full z-10 flex flex-col items-start">
        {/* Back Button */}
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-accent-yellow transition-colors cursor-pointer group bg-surface-dark/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg mb-8"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </button>

        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-accent-yellow/10 border border-accent-yellow/20 flex items-center justify-center text-accent-yellow">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="font-heading font-black text-3xl md:text-4xl uppercase tracking-tighter text-on-surface select-none">
              Privacy <span className="text-outline-accent">Policy</span>
            </h1>
            <p className="text-xs text-on-surface-variant/70 uppercase tracking-widest font-mono mt-1">
              Effective Date: May 2026
            </p>
          </div>
        </div>

        {/* Content Box */}
        <div className="w-full bg-[#0A1228]/45 border border-white/5 backdrop-blur-xl rounded-[24px] p-8 md:p-10 shadow-2xl text-left space-y-8 text-on-surface-variant text-sm leading-relaxed">
          
          <p className="text-on-surface font-medium border-b border-white/5 pb-4">
            Baithak is committed to protecting your privacy. This Privacy Policy outlines what information we collect, why we collect it, how we use it, and your rights concerning your personal data.
          </p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface font-heading flex items-center gap-2 select-none">
              <span className="text-accent-yellow font-mono text-sm">01.</span> Information Collected
            </h2>
            <div className="space-y-4 pl-6">
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">Account Information</h3>
                <p>We collect details you provide when setting up your profile, including your full name, display name, email address, username, and profile picture/avatar selection.</p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">Educational Information</h3>
                <p>
                  To verify your campus status, we collect university/institution name, branch or course of study, year, registration/roll number, and a photo of your registration card or student ID.
                </p>
                <p className="text-xs text-accent-yellow/80 mt-1 italic">
                  Currently, Veer Surendra Sai University of Technology (VSSUT) students may upload their registration cards. Students from other universities/colleges may be asked to do so in the future as we scale.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">Platform Activity</h3>
                <p>We store your posts, comments, likes/upvotes, flags/reports, and direct user-to-user interactions on the platform to display them properly inside your campus feed.</p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">Technical Information</h3>
                <p>We automatically collect basic connection log parameters: device information, browser type, IP address, and general usage and analytics data to maintain platform performance and security.</p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface font-heading flex items-center gap-2 select-none">
              <span className="text-accent-yellow font-mono text-sm">02.</span> Purpose of Collecting Information
            </h2>
            <p className="pl-6">
              Baithak collects and processes your personal data to:
            </p>
            <ul className="list-disc pl-11 space-y-1.5">
              <li>Manage accounts, verify student status, and authenticate user logins.</li>
              <li>Provide and support discussion forum operations and features.</li>
              <li>Perform community moderation, review reported abuse, and ensure user safety.</li>
              <li>Monitor, optimize, and improve platform performance.</li>
              <li>Detect and prevent spam, fraud, multi-account abuse, and other forms of misuse.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface font-heading flex items-center gap-2 select-none">
              <span className="text-accent-yellow font-mono text-sm">03.</span> Verification Information & Security
            </h2>
            <div className="space-y-4 pl-6">
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">1. Restricted Use</h3>
                <p>Documents uploaded for student verification (like ID cards or registration receipts) are accessed solely for authentication, moderation, and platform safety. They undergo automated scan parsing (via Gemini API) or manual administrator review.</p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">2. Retention</h3>
                <p>Verification files are retained only for the period reasonably necessary to authenticate your credentials and prevent fraudulent enrollment attempts.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface font-heading flex items-center gap-2 select-none">
              <span className="text-accent-yellow font-mono text-sm">04.</span> User Content Visibility
            </h2>
            <p className="pl-6">
              The posts, replies, and comments you publish on Baithak are visible to other members of your campus community depending on channel settings. Please avoid sharing highly private details (such as bank details, phone numbers, or passwords) within public discussions.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface font-heading flex items-center gap-2 select-none">
              <span className="text-accent-yellow font-mono text-sm">05.</span> Data Sharing & Third-Parties
            </h2>
            <div className="space-y-4 pl-6">
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">No selling of data</h3>
                <p>Baithak does not sell, lease, or rent your personal information to third parties.</p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">Circumstances of sharing</h3>
                <p>We may share user data only when required to do so by applicable laws, legal orders, necessary platform security enforcement, or under-contract cloud/service providers assisting in platform operations.</p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface font-heading flex items-center gap-2 select-none">
              <span className="text-accent-yellow font-mono text-sm">06.</span> Security Measures
            </h2>
            <p className="pl-6">
              We employ industry-standard physical, electronic, and administrative safeguards to protect your personal details against unauthorized access, disclosure, or modifications. However, no internet-facing digital system is 100% secure, and we cannot guarantee absolute data safety.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface font-heading flex items-center gap-2 select-none">
              <span className="text-accent-yellow font-mono text-sm">07.</span> User Rights & Deletion
            </h2>
            <div className="space-y-4 pl-6">
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">1. Access & Correction</h3>
                <p>You can view and modify standard profile info (display name, avatar) within your account settings.</p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">2. Account Deletion</h3>
                <p>You may request deletion of your account. Upon deletion, your public profile information is removed or anonymized. Certain discussion posts or comments may remain visible (anonymized) to preserve the flow and integrity of public conversations.</p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">3. Information Retention</h3>
                <p>We may retain limited operational metadata for a reasonable duration for security enforcement, fraud prevention, legal compliance, or moderation bans.</p>
              </div>
            </div>
          </section>

        </div>
        
        {/* Footer note */}
        <p className="text-[10px] text-on-surface-variant/40 mt-6 w-full text-center">
          © 2026 Baithak. Designed for midnight academic communities.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPageClient;
