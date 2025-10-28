/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from 'react'
import { useToast } from '../hooks/useToast'

const KEY = 'tickets'
export const TicketsContext = createContext(null)



export function TicketsProvider({ children }) {
    const [tickets, setTickets] = useState([])
    const toast = useToast()

    useEffect(() => {
        try {
            const raw = localStorage.getItem(KEY)
            if (raw) setTickets(JSON.parse(raw))
        } catch (err) {
            console.error('Failed to load tickets', err)
            toast?.show?.('Failed to load tickets. Please retry.', 'error')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const save = (list) => {
        try {
            localStorage.setItem(KEY, JSON.stringify(list))
        } catch (err) {
            console.error('Failed to save tickets', err)
            toast?.show?.('Failed to save tickets. Please retry.', 'error')
        }
    }

    const addTicket = (t) => {
        const newTicket = { ...t, id: Date.now() }
        const updated = [...tickets, newTicket]
        setTickets(updated)
        save(updated)
        toast?.show?.('Ticket created successfully!', 'success')
    }

    const updateTicket = (id, data) => {
        const updated = tickets.map(t => t.id === id ? { ...t, ...data } : t)
        setTickets(updated)
        save(updated)
        toast?.show?.('Ticket updated successfully!', 'success')
    }

    const deleteTicket = (id) => {
        const updated = tickets.filter(t => t.id !== id)
        setTickets(updated)
        save(updated)
        toast?.show?.('Ticket deleted successfully!', 'success')
    }

    return (
        <TicketsContext.Provider value={{ tickets, addTicket, updateTicket, deleteTicket }}>
            {children}
        </TicketsContext.Provider>
    )
}