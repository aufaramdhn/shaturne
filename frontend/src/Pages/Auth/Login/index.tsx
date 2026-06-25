import LoginForm from '@/Components/Fragments/Forms/LoginForm'
import { useSeo } from '@/Hooks/Common/useSeo'

export default function Login() {
  useSeo({ title: 'Masuk | Shaturne', noindex: true })

  return <LoginForm />
}
