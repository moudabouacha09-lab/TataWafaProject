import { redirect } from 'next/navigation';

export default function MyRequestsRedirectPage() {
  redirect('/client/demandes');
}
