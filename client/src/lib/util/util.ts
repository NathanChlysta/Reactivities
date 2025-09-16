import { format, type DateArg } from "date-fns";
import z from "zod";

export function formatDate(date: DateArg<Date>) {
    return format(date, 'dd MMM yyyy h:mm a')
}

export const requiredString = (fieldname: string) => z
    .string({ error: `${fieldname} is required` })
    .trim().min(1, { message: `${fieldname} is required` });