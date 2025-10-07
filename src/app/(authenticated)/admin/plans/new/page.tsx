import { redirect } from 'next/navigation';

export default function NewPlanPage() {
    redirect('/admin/plans/new/edit');
}
