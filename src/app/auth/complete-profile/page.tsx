import { CompleteProfileForm } from '@/components/complete-profile-form'
import { AuthHeader } from '@/components/auth-header'

export default function Page() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-zinc-950">
            <div className="w-full max-w-md">
                <AuthHeader
                    // title="Completar Perfil"
                    subtitle="Completa tu información para comenzar a usar ProSocial Platform"
                />
                <CompleteProfileForm />
            </div>
        </div>
    )
}
