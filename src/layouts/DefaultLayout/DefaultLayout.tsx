import Box from '@mui/material/Box'
import React, { ReactNode } from 'react'

type DefaultLayoutprops = {
    children: ReactNode
}
const DefaultLayout = ({ children }: DefaultLayoutprops) => {
    return (
        <Box marginX={10} marginTop={10}>
            {children}
        </Box>
    )
}

export default DefaultLayout
