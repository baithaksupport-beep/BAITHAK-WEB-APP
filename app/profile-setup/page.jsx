import ProfileSetupPageClient from "./ProfileSetupPageClient";

export const metadata = {
  title: 'Profile Setup',
  description: 'Complete your profile setup to join the Baithak student discussion circle.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfileSetupPage() {
  const isDev = process.env.NODE_ENV === 'development';
  const siteKey = process.env.YOUR_PUBLIC_SITEKEY?.trim() || (isDev ? "1x00000000000000000000AA" : "0x4AAAAAAEfUxjs1vPVT9wmZ");
  return <ProfileSetupPageClient siteKey={siteKey} />;
}
