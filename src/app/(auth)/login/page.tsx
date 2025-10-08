import { LoginForm } from '@/components/login-form'
import { AuthHeader } from '@/components/auth-header'

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-zinc-950">
      <div className="w-full max-w-sm">
        <AuthHeader
          // title="Bienvenido"
          subtitle="Ingresa a tu cuenta para acceder al tu panel de administración en ProSocial Platform"
        />
        <LoginForm />
      </div>
    </div>
  )
}
