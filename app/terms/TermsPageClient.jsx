"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText } from 'lucide-react';

const TermsPageClient = () => {
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
            <FileText size={20} />
          </div>
          <div>
            <h1 className="font-heading font-black text-3xl md:text-4xl uppercase tracking-tighter text-on-surface select-none">
              Terms & <span className="text-outline-accent">Conditions</span>
            </h1>
            <p className="text-xs text-on-surface-variant/70 uppercase tracking-widest font-mono mt-1">
              Effective Date: May 2026
            </p>
          </div>
        </div>

        {/* Content Box */}
        <div className="w-full bg-[#0A1228]/45 border border-white/5 backdrop-blur-xl rounded-[24px] p-8 md:p-10 shadow-2xl text-left space-y-8 text-on-surface-variant text-sm leading-relaxed">
          
          <p className="text-on-surface font-medium border-b border-white/5 pb-4">
            Welcome to Baithak. Please read these Terms and Conditions carefully before using our platform. By creating an account or using Baithak, you agree to comply with and be bound by these terms.
          </p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface font-heading flex items-center gap-2 select-none">
              <span className="text-accent-yellow font-mono text-sm">01.</span> Eligibility Criteria
            </h2>
            <div className="space-y-4 pl-6">
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">1. Minimum age requirement</h3>
                <p>Users must be at least 16 years of age to create and maintain an account on Baithak.</p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">2. Intended user community</h3>
                <p>Baithak is designed primarily for students and educational communities. Users should be currently enrolled in, or associated with, a recognized educational institution.</p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">3. Institution information</h3>
                <p>Users may be required to provide accurate information during registration, including but not limited to: Institution/University name, program, department, course, year of study, and registration number or other requested academic details.</p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">4. Verification eligibility</h3>
                <p>During initial platform stages, students from selected institutions (including Veer Surendra Sai University of Technology - VSSUT) may undergo verification procedures and receive a verification badge. Users from other institutions may still create accounts but may not initially receive verified status.</p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">5. Accuracy of information</h3>
                <p>Users must provide truthful, complete, and current information. Providing false, misleading, or impersonated information may result in removal of verification status, temporary suspension, or permanent account termination.</p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">6. Feature access limitations</h3>
                <p>Access to certain platform features, channels, or activities may vary depending on verification status, platform safety measures, and community guidelines.</p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">7. Account authenticity</h3>
                <p>Users may not create accounts for the purpose of impersonation, spam, moderation evasion, or any deceptive activity. Baithak reserves the right to deny, suspend, or revoke access at its sole discretion.</p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface font-heading flex items-center gap-2 select-none">
              <span className="text-accent-yellow font-mono text-sm">02.</span> Account Registration & Verification
            </h2>
            <div className="space-y-4 pl-6">
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">1. Account creation</h3>
                <p>Users may create an account on Baithak using Google sign-in authentication or other email-based authentication methods made available by Baithak.</p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">2. Account responsibility</h3>
                <p>Users are responsible for maintaining the security of their credentials, preventing unauthorized access, and reporting suspected security concerns. Baithak is not liable for losses due to compromised accounts.</p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">3. One account policy</h3>
                <p>Users may not create multiple accounts for spam, manipulating engagement, impersonation, or circumventing restrictions and bans.</p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">4. Verification badge</h3>
                <p>Verification badges confirm only that a user has completed Baithak's verification process. It should not be interpreted as endorsement, institutional affiliation, or a guarantee regarding user conduct or content.</p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">5. Modifying information</h3>
                <p>Verified users may not modify information used for verification (such as university name or registration numbers). Editable details like display names can be changed subject to platform guidelines.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface font-heading flex items-center gap-2 select-none">
              <span className="text-accent-yellow font-mono text-sm">03.</span> User Content & Community Guidelines
            </h2>
            <div className="space-y-4 pl-6">
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">1. Ownership of content</h3>
                <p>Users retain ownership of the content they post on Baithak. By posting, you grant Baithak a non-exclusive license to display, store, reproduce, and distribute your content for platform functionality and operations.</p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">2. Prohibited activities</h3>
                <p>Users are solely responsible for posts, comments, and uploads. The following content is strictly prohibited:</p>
                <ul className="list-disc pl-5 mt-1.5 space-y-1">
                  <li>Harassment, bullying, hate speech, or personal attacks.</li>
                  <li>Impersonation, creating fake identities, or misleading other users.</li>
                  <li>Sharing personal information of others (phone numbers, emails, addresses, IDs) without consent.</li>
                  <li>Spamming, repetitive posts, and artificial engagement manipulation.</li>
                  <li>Academic fraud, cheating, sharing unauthorized examination materials, or exam leakage.</li>
                  <li>Sexually explicit, adult content, nudity, or inappropriate material.</li>
                  <li>Illegal or dangerous activities, promoting violence, fraud, and malicious software.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">3. Anonymous posting</h3>
                <p>If anonymous posting features are available, anonymous content remains subject to all platform policies. Anonymity applies only to public visibility and does not prevent internal moderation or enforcement actions.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface font-heading flex items-center gap-2 select-none">
              <span className="text-accent-yellow font-mono text-sm">04.</span> Privacy, Data Collection & Use
            </h2>
            <p className="pl-6">
              We collect account registration data, educational details (university, branch), platform activity (posts, comments), and technical info. We do not sell user data to third parties. For complete details, please read our <a onClick={() => router.push('/privacy')} className="text-accent-yellow hover:underline font-semibold cursor-pointer">Privacy Policy</a>.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface font-heading flex items-center gap-2 select-none">
              <span className="text-accent-yellow font-mono text-sm">05.</span> Intellectual Property Rights
            </h2>
            <div className="space-y-4 pl-6">
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">1. Platform ownership</h3>
                <p>All rights related to Baithak, including interface designs, logos, visual branding, codebase, and features, are owned by Baithak or its licensors and are protected under intellectual property laws.</p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">2. Restrictions</h3>
                <p>Users may not copy substantial portions of the platform, reverse engineer systems, or create misleading copies/imitations of Baithak branding without authorization.</p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface font-heading flex items-center gap-2 select-none">
              <span className="text-accent-yellow font-mono text-sm">06.</span> Disclaimers & Limitation of Liability
            </h2>
            <div className="space-y-4 pl-6">
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">1. No professional advice</h3>
                <p>Baithak is a discussion platform. It does not provide professional, legal, financial, medical, academic, or placement advisory services. Any career or educational advice is shared by users for informational purposes only.</p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">2. No content guarantee</h3>
                <p>We do not guarantee the accuracy, completeness, or reliability of user-generated content. Users should independently evaluate information before relying on it.</p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs uppercase tracking-wide">3. Limitation of liability</h3>
                <p>To the maximum extent permitted by law, Baithak, its owners, and team members shall not be liable for losses, claims, or damages arising from the use of the platform, reliance on user-generated content, or user-to-user interactions.</p>
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

export default TermsPageClient;
