import { useState } from 'react'
import Button from '@/Components/Elements/Button'
import Input from '@/Components/Elements/Input'
import Textarea from '@/Components/Elements/Textarea'
import Select from '@/Components/Elements/Select'
import Modal from '@/Components/Elements/Modal'
import { useDashExperience } from '@/Hooks/Dashboard/useDashExperience'
import type { DashExperience } from '@/Services/Dashboard/dashboardService'

const TYPES = [
  { value: 'work', label: 'Kerja' },
  { value: 'organization', label: 'Organisasi' },
  { value: 'education', label: 'Pendidikan' },
  { value: 'internship', label: 'Magang' },
]

interface FormState {
  titleId: string
  titleEn: string
  organization: string
  start_date: string
  end_date: string
  type: string
  descId: string
  descEn: string
}

const EMPTY: FormState = {
  titleId: '',
  titleEn: '',
  organization: '',
  start_date: '',
  end_date: '',
  type: 'work',
  descId: '',
  descEn: '',
}

export default function Experience() {
  const { items, isLoading, saving, errors, clearErrors, create, update, remove } =
    useDashExperience()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<DashExperience | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    clearErrors()
    setOpen(true)
  }

  function openEdit(exp: DashExperience) {
    setEditing(exp)
    setForm({
      titleId: exp.title.id,
      titleEn: exp.title.en,
      organization: exp.organization,
      start_date: exp.start_date ?? '',
      end_date: exp.end_date ?? '',
      type: exp.type,
      descId: exp.description?.id ?? '',
      descEn: exp.description?.en ?? '',
    })
    clearErrors()
    setOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      title: { id: form.titleId, en: form.titleEn },
      organization: form.organization,
      start_date: form.start_date,
      end_date: form.end_date || null,
      type: form.type,
      description: { id: form.descId, en: form.descEn },
    }
    const ok = editing ? await update(editing.uuid, payload) : await create(payload)
    if (ok) setOpen(false)
  }

  async function handleDelete(exp: DashExperience) {
    if (!window.confirm(`Hapus "${exp.title.id}"?`)) return
    await remove(exp.uuid)
  }

  return (
    <div>
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[length:var(--text-h2)] font-bold text-[var(--color-text)]">
            Pengalaman
          </h1>
          <p className="mt-1 text-[var(--color-text-muted)]">
            {isLoading ? 'Memuat…' : `${items.length} entri`}
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          + Tambah
        </Button>
      </header>

      <div className="flex flex-col gap-3">
        {items.map(exp => (
          <div
            key={exp.uuid}
            className="flex items-start justify-between gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-5"
          >
            <div>
              <span className="font-[var(--font-mono)] text-[0.75rem] tracking-[0.04em] text-[var(--color-accent)]">
                {exp.start_date?.slice(0, 4)} /{' '}
                {exp.end_date ? exp.end_date.slice(0, 4) : 'Sekarang'}
              </span>
              <h2 className="mt-1 text-[1.0625rem] font-bold text-[var(--color-text)]">
                {exp.title.id}
              </h2>
              <span className="text-[0.875rem] text-[var(--color-text-muted)]">
                {exp.organization}
              </span>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => openEdit(exp)}
                className="rounded-lg px-3 py-1.5 text-[0.8125rem] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-accent)]"
              >
                Ubah
              </button>
              <button
                onClick={() => handleDelete(exp)}
                className="rounded-lg px-3 py-1.5 text-[0.8125rem] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-error)]"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Ubah Pengalaman' : 'Pengalaman Baru'}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Judul (ID)"
              required
              value={form.titleId}
              onChange={e => setForm({ ...form, titleId: e.target.value })}
              error={errors['title.id']}
            />
            <Input
              label="Title (EN)"
              required
              value={form.titleEn}
              onChange={e => setForm({ ...form, titleEn: e.target.value })}
              error={errors['title.en']}
            />
          </div>
          <Input
            label="Organisasi"
            required
            value={form.organization}
            onChange={e => setForm({ ...form, organization: e.target.value })}
            error={errors.organization}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Mulai"
              type="date"
              required
              value={form.start_date}
              onChange={e => setForm({ ...form, start_date: e.target.value })}
              error={errors.start_date}
            />
            <Input
              label="Selesai (kosong = kini)"
              type="date"
              value={form.end_date}
              onChange={e => setForm({ ...form, end_date: e.target.value })}
              error={errors.end_date}
            />
          </div>
          <Select
            label="Jenis"
            options={TYPES}
            value={form.type}
            onChange={v => setForm({ ...form, type: v })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Textarea
              label="Deskripsi (ID)"
              rows={3}
              value={form.descId}
              onChange={e => setForm({ ...form, descId: e.target.value })}
              error={errors['description.id']}
            />
            <Textarea
              label="Description (EN)"
              rows={3}
              value={form.descEn}
              onChange={e => setForm({ ...form, descEn: e.target.value })}
              error={errors['description.en']}
            />
          </div>
          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" isLoading={saving}>
              {editing ? 'Simpan' : 'Buat'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
