import { supabase } from '../lib/supabase'

export const tableNames = ['departments', 'patients', 'doctors', 'appointments', 'rooms', 'admissions', 'prescriptions', 'prescription_items', 'medicines', 'bills', 'payments']

export async function listTable(table) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase.from(table).select('*')
  if (error) throw error
  return data || []
}

export async function createRecord(table, values) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase.from(table).insert(values).select().single()
  if (error) throw error
  return data
}

export async function updateRecord(table, idColumn, id, values) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase.from(table).update(values).eq(idColumn, id).select().single()
  if (error) throw error
  return data
}

export async function deleteRecord(table, idColumn, id) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase.from(table).delete().eq(idColumn, id)
  if (error) throw error
}

export async function savePrescriptionWithItems(values, items, existingId) {
  if (!supabase) throw new Error('Supabase is not configured.')
  let prescription
  if (existingId) {
    const { data, error } = await supabase.from('prescriptions').update(values).eq('prescription_id', existingId).select().single()
    if (error) throw error
    prescription = data
    const { error: deleteError } = await supabase.from('prescription_items').delete().eq('prescription_id', existingId)
    if (deleteError) throw deleteError
  } else {
    prescription = await createRecord('prescriptions', values)
  }
  const validItems = items.filter(item => item.medicine_id)
  if (validItems.length) {
    const { error } = await supabase.from('prescription_items').insert(validItems.map(item => ({ ...item, prescription_id: prescription.prescription_id })))
    if (error) {
      if (!existingId) await supabase.from('prescriptions').delete().eq('prescription_id', prescription.prescription_id)
      throw error
    }
  }
  return prescription
}
