import { useEffect } from 'react';
import { EmptyState } from "../components/ui/empty-state"
import { List } from "@chakra-ui/react"
import { MdErrorOutline  } from "react-icons/md"

export default function Song(){
    useEffect(() => {
        document.title = "404 Not Found";
    }, []);

    return (
        <EmptyState
            icon={<MdErrorOutline />}
            title="Page Not Found"
            description="This page isn't available."
        >
            <List.Root variant="marker">
                <List.Item>Try searching for something else.</List.Item>
            </List.Root>
        </EmptyState>
    )
}