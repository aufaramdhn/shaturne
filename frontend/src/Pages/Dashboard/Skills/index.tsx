import { useState } from 'react'
import Button from '@/Components/Elements/Button'
import Input from '@/Components/Elements/Input'
import RangeSlider from '@/Components/Elements/RangeSlider'
import Modal from '@/Components/Elements/Modal'
import { useDashSkills } from '@/Hooks/Dashboard/useDashSkills'
import type { DashSkill } from '@/Services/Dashboard/dashboardService'

interface FormState {
  name: string
  categoryId: string
  categoryEn: string
  proficiency: string
}

const EMPTY: FormState = { name: '', categoryId: '', categoryEn: '', proficiency: '70' }

export default function Skills() {
  const { items, isLoading, saving, errors, clearErrors, create, update, remove } = useDashSkills()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<DashSkill | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    clearErrors()
    setOpen(true)
  }

  function openEdit(s: DashSkill) {
    setEditing(s)
    setForm({
      name: s.name,
      categoryId: s.category.id,
      categoryEn: s.category.en,
      proficiency: String(s.proficiency),
    })
    clearErrors()
    setOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      name: form.name,
      category: { id: form.categoryId, en: form.categoryEn },
      proficiency: Number(form.proficiency) || 0,
    }
    const ok = editing ? await update(editing.uuid, payload) : await create(payload)
    if (ok) setOpen(false)
  }

  async function handleDelete(s: DashSkill) {
    if (!window.confirm(`Hapus keahlian "${s.name}"?`)) return
    await remove(s.uuid)
  }

  return (
    <div>
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[length:var(--text-h2)] font-bold text-[var(--color-text)]">
            Keahlian
          </h1>
          <p className="mt-1 text-[var(--color-text-muted)]">
            {isLoading ? 'Memuat…' : `${items.length} keahlian`}
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          + Tambah
        </Button>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60">
        <table className="w-full min-w-[560px] text-left text-[0.9375rem]">
          <thead>
            <tr className="border-b border-[var(--color-border)] font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
              <th className="px-5 py-3 font-medium">Nama</th>
              <th className="px-5 py-3 font-medium">Kategori</th>
              <th className="px-5 py-3 font-medium">Level</th>
              <th className="px-5 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map(s => (
              <tr
                key={s.uuid}
                className="border-b border-[var(--color-border)] transition-colors last:border-0 hover:bg-[var(--color-surface-raised)]/50"
              >
                <td className="px-5 py-4 font-semibold text-[var(--color-text)]">{s.name}</td>
                <td className="px-5 py-4 text-[var(--color-text-muted)]">{s.category.id}</td>
                <td className="px-5 py-4 font-[var(--font-mono)] text-[var(--color-text-muted)]">
                  {s.proficiency}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(s)}
                      className="rounded-lg px-3 py-1.5 text-[0.8125rem] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-accent)]"
                    >
                      Ubah
                    </button>
                    <button
                      onClick={() => handleDelete(s)}
                      className="rounded-lg px-3 py-1.5 text-[0.8125rem] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-error)]"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Ubah Keahlian' : 'Keahlian Baru'}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input
            label="Nama"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            error={errors.name}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Kategori (ID)"
              required
              value={form.categoryId}
              onChange={e => setForm({ ...form, categoryId: e.target.value })}
              error={errors['category.id']}
              placeholder="Frontend, Keamanan, …"
            />
            <Input
              label="Category (EN)"
              required
              value={form.categoryEn}
              onChange={e => setForm({ ...form, categoryEn: e.target.value })}
              error={errors['category.en']}
              placeholder="Frontend, Security, …"
            />
          </div>
          <RangeSlider
            label="Level"
            suffix="/100"
            min={0}
            max={100}
            value={Number(form.proficiency) || 0}
            onChange={v => setForm({ ...form, proficiency: String(v) })}
            error={errors.proficiency}
          />
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
