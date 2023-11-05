"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import React from "react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { BASE_URL } from "@/utils/constants"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Book title is required!",
    }),
})

type AddBookFormProp = {
    setIsNewBookAdded: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddBookForm({ setIsNewBookAdded }: AddBookFormProp) {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        let response;
        try {
            response = await fetch(`${BASE_URL}/books`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    title: values.title,
                    status: "to_be_read",
                }),
            });
        } catch (err) {
            toast({
                description: "Could not connect to the server, please try again later.",
            })
            return;
        }
        if (response.status !== 200) {
            toast({
                description: "Something went wrong",
            })
            return;
        }
        form.reset();
        setIsNewBookAdded(pre => !pre);
        toast({
            description: "New Book Added.",
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">

                            <FormLabel>Book Title</FormLabel>
                            <FormControl className="w-60">
                                <Input placeholder="title" {...field} />
                            </FormControl>
                            <FormMessage />

                        </FormItem>
                    )}
                />
                <Button type="submit">Create</Button>
            </form>
        </Form>
    )
}
