import { useContext } from "react"
import { TicketsContext } from "../contexts/TicketsContext"


export function useTickets() { return useContext(TicketsContext) };