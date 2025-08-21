import { redirect } from 'next/navigation';

export default function BlogPage() {
  redirect('/blog/english');
  return null;
}
// ...removed leftover JSX...

