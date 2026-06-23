import { useState } from 'react'
import Badge from '@/Components/Elements/Badge'
import Button from '@/Components/Elements/Button'
import Input from '@/Components/Elements/Input'
import Textarea from '@/Components/Elements/Textarea'
import Switch from '@/Components/Elements/Switch'
import Modal from '@/Components/Elements/Modal'
import FileUpload from '@/Components/Elements/FileUpload'
import type { MediaItem } from '@/Components/Elements/FileUpload'
import { useFetch } from '@/Hooks/Dashboard/useFetch'
import {
  getDashProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadMedia,
  deleteMedia,
} from '@/Services/Dashboard/dashboardService'
import type { DashProject } from '@/Services/Dashboard/dashboardService'

interface FormState {
  titleId: string
  titleEn: string
  descId: string
  descEn: string
  stack: string
  repo_url: string
  demo_url: string
  is_published: boolean
  images: MediaItem[]
}

const EMPTY: FormState = {
  titleId: '',
  titleEn: '',
  descId: '',
  descEn: '',
  stack: '',
  repo_url: '',
  demo_url: '',
  is_published: false,
  images: [],
}

export default function Projects() {
  const { data, isLoading, reload } = useFetch(getDashProjects)
  const projects = data ?? []

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<DashProject | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setErrors({})
    setOpen(true)
  }

  function openEdit(p: DashProject) {
    setEditing(p)
    setForm({
      titleId: p.title.id,
      titleEn: p.title.en,
      descId: p.description.id,
      descEn: p.description.en,
      stack: p.stack.join(', '),
      repo_url: p.repo_url ?? '',
      demo_url: p.demo_url ?? '',
      is_published: p.is_published,
      images: [...p.images]
        .sort((a, b) => a.order - b.order)
        .map(img => ({ path: img.path, url: img.url })),
    })
    setErrors({})
    setOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    const payload = {
      title: { id: form.titleId, en: form.titleEn },
      description: { id: form.descId, en: form.descEn },
      stack: form.stack
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      repo_url: form.repo_url || null,
      demo_url: form.demo_url || null,
      is_published: form.is_published,
      images: form.images.map(img => img.path),
    }
    try {
      if (editing) await updateProject(editing.uuid, payload)
      else await createProject(payload)
      setOpen(false)
      reload()
    } catch (err) {
      const e2 = err as { response?: { data?: { errors?: Record<string, string[]> } } }
      const apiErrors = e2.response?.data?.errors
      if (apiErrors) {
        const mapped: Record<string, string> = {}
        for (const [k, v] of Object.entries(apiErrors)) mapped[k] = v[0]
        setErrors(mapped)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(p: DashProject) {
    if (!window.confirm(`Hapus proyek "${p.title.id}"?`)) return
    await deleteProject(p.uuid)
    reload()
  }

  return (
    <div>
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[length:var(--text-h2)] font-bold text-[var(--color-text)]">
            Proyek
          </h1>
          <p className="mt-1 text-[var(--color-text-muted)]">
            {isLoading ? 'Memuat…' : `${projects.length} entri`}
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          + Tambah
        </Button>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60">
        <table className="w-full min-w-[640px] text-left text-[0.9375rem]">
          <thead>
            <tr className="border-b border-[var(--color-border)] font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
              <th className="px-5 py-3 font-medium">Judul</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr
                key={p.uuid}
                className="border-b border-[var(--color-border)] transition-colors last:border-0 hover:bg-[var(--color-surface-raised)]/50"
              >
                <td className="px-5 py-4">
                  <p className="font-semibold text-[var(--color-text)]">{p.title.id}</p>
                  <p className="mt-0.5 max-w-md truncate text-[0.8125rem] text-[var(--color-text-muted)]">
                    {p.description.id}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <Badge variant={p.is_published ? 'accent' : 'default'}>
                    {p.is_published ? 'rilis' : 'draf'}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="rounded-lg px-3 py-1.5 text-[0.8125rem] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-accent)]"
                    >
                      Ubah
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="rounded-lg px-3 py-1.5 text-[0.8125rem] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-error)]"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && projects.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-[var(--color-text-muted)]">
                  Belum ada proyek. Klik “Tambah”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Ubah Proyek' : 'Proyek Baru'}
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
          <div className="grid gap-4 sm:grid-cols-2">
            <Textarea
              label="Deskripsi (ID)"
              required
              rows={4}
              value={form.descId}
              onChange={e => setForm({ ...form, descId: e.target.value })}
              error={errors['description.id']}
            />
            <Textarea
              label="Description (EN)"
              required
              rows={4}
              value={form.descEn}
              onChange={e => setForm({ ...form, descEn: e.target.value })}
              error={errors['description.en']}
            />
          </div>
          <Input
            label="Stack (pisah koma)"
            value={form.stack}
            onChange={e => setForm({ ...form, stack: e.target.value })}
            placeholder="React, TypeScript, Laravel"
          />
          <Input
            label="Repo URL"
            value={form.repo_url}
            onChange={e => setForm({ ...form, repo_url: e.target.value })}
            error={errors.repo_url}
            placeholder="https://github.com/…"
          />
          <Input
            label="Demo URL"
            value={form.demo_url}
            onChange={e => setForm({ ...form, demo_url: e.target.value })}
            error={errors.demo_url}
            placeholder="https://…"
          />
          <FileUpload
            label="Gambar"
            value={form.images}
            onChange={images => setForm({ ...form, images })}
            onUpload={uploadMedia}
            onRemove={deleteMedia}
          />
          <Switch
            checked={form.is_published}
            onChange={v => setForm({ ...form, is_published: v })}
            label="Terbitkan (publik)"
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
