import { redirect } from 'next/navigation';

export default function ProfilePage({
    params
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    redirect(`/${slug}/inicio`);
}
