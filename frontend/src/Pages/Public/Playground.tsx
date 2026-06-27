import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/Animations/variants'
import { useLanguage } from '@/Context/LanguageContext'
import ChatWindow from '@/Components/Fragments/Chat/ChatWindow'

export default function Playground() {
  const { t } = useLanguage()

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-3xl px-5 py-24"
    >
      <motion.h1
        variants={fadeUp}
        className="text-[length:var(--text-h1)] font-bold tracking-[-0.02em] text-[var(--color-text)]"
      >
        {t('playground.title')}
      </motion.h1>

      <motion.div variants={fadeUp} className="mt-10">
        <ChatWindow />
      </motion.div>
    </motion.section>
  )
}
