import React, { useEffect, useState } from 'react'
import { createTaskToken, loadTasks, redeemTask } from './ToDoManager'
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    List,
    ListItem,
    ListItemText,
    CircularProgress
}   from '@mui/material'
import Footer from './Utils/footer'


export default function App() {
    const [tasks, setTasks] = useState<Array<{
        task: string,
        sats: number,
        token: { txid: string, outputIndex: number, lockingScript: any }
    }>>([])

    const [newTask, setNewTask] = useState('')
    const [creating, setCreating] = useState(false)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('')

    const fetchTasks = async () => {
        setLoading(true)
        setStatus('Loading tasks...')
        try {
            const result = await loadTasks()
            setTasks(result)
            setStatus('')
        }   catch (err: any) {
            console.error(err)
            setStatus('Failed to load tasks.')
        }   finally {
            setLoading(false)
        }
    }

    const handleCreate = async () => {
        if (!newTask.trim()) return
        setCreating(true)
        setStatus('Creating task...')

        try {
            if (newTask.trim().length < 3) {
                setStatus('Task mist be at least 3 chars')
                return
            }

            await createTaskToken(newTask.trim(), 1)
            setNewTask('')
            setStatus('Task created!')
            await fetchTasks()

        }   catch (err: any) {
            console.error(err)
            const message = err.message || 'Unknown error'
            setStatus(`Failed to create task: ${message}. Check Metane Client Connectivity.`)

        }   finally {
                setCreating(false)
        }

    // TODO: Enhance the error-handling logic for task creation:
    // 1. Verify that newTask is not empty and meets any length requirements (e.g., at least 3 characters).
    // 2. Call createTaskToken with newTask and a fixed amount (e.g., 1 satoshi).
    // 3. On success, clear newTask, update status to 'Task created!', and refresh the task list by calling fetchTasks.
    // 4. On error, update status with a user-friendly message (e.g., 'Failed to create task: [error message]. Check Metanet client connectivity.').
    // 5. Ensure creating state is reset in a finally block.

    }

    const handleRedeem = async (idx: number) => {
        const t = tasks[idx]
        setStatus(`Redeming: "${t.task}"`)
        try {
            await redeemTask({
                txid: t.token.txid,
                outputIndex: t.token.outputIndex,
                lockingScript: t.token.lockingScript,
                amount: t.sats
            })
            setStatus(`Task "${t.task}" completed.`)
            await fetchTasks()
        }   catch (err: any) {
            console.error(err)
            setStatus('Redemption failed.')
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    return (
       <>
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
             Lab L-7: ToDo List
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, my: 3 }}>
                <TextField
                fullWidth
                label="New Task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
            />
            <Button
                variant="contained"
                onClick={handleCreate}
                disabled={creating}
            >
                {creating ? 'Creating...' : 'Add Task'}
            </Button>
            </Box>

            {status && (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {status}
            </Typography>
            )}

            {loading ? (
            <Box display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
            ) : tasks.length === 0 ? (
                <Typography>No tasks found. Add one!</Typography>
            ) : (
                <Box
                    sx={{
                        maxWidth: '900px',
                        overflowX: 'auto',
                        whiteSpace: 'nowrap',
                        fontFamily: 'monospace',
                        bgcolor: 'grey.900',
                        color: 'white',
                        borderRadius: 2,
                        p: 2,
                        mt: 2
                        }}
                >
                <List>
                {tasks.map((t, idx) => (
                    <ListItem
                    key={idx}
                    secondaryAction={
                        <Button variant="outlined" onClick={() => handleRedeem(idx)}>
                        Complete
                        </Button>
                    }
                    >
                    <ListItemText primary={t.task} />
                    </ListItem>
                ))}
                </List>
            </Box>
            )}
        </Container>
        <Footer />
        </> 
    )
}
