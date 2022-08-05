import {
    Box,
    Button,
    Card,
    Checkbox,
    CircularProgress,
    Divider,
    FormControl,
    FormGroup,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    MenuItem,
    Modal,
    Select,
    TextField,
    Typography,
} from '@mui/material'
import type { NextPage } from 'next'
import { useState } from 'react'
import DownloadIcon from '@mui/icons-material/Download'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import DeleteIcon from '@mui/icons-material/Delete'
import ErrorIcon from '@mui/icons-material/Error'
import Layout from '../components/layout'
import axios from 'axios'
import JSZip from 'jszip'

type imageType = 'jpeg' | 'png'

type capture = {
    id: number
    url: string
    checked: boolean
    imageName: string
    imageUrl: string | null
    imageBlob: string | null
    errorMessage: string | null
}

type scale = {
    value: number
    label: string
}

type form = {
    url: string
    width: number
    height: number
    scale: number
}

const Home: NextPage = () => {
    const scales: scale[] = [
        { value: 1, label: '@1x' },
        { value: 2, label: '@2x(Retina)' },
        { value: 3, label: '@3x(Retina)' },
    ]
    const [imageType, setImageType] = useState<imageType>('png')
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [modalImage, setModalImage] = useState<string>('')
    const [form, setForm] = useState<form>({
        url: '',
        width: 1280,
        height: 960,
        scale: 1,
    })
    const [captureList, setCaptureList] = useState<capture[]>([])
    const [captureSequence, setCaptureSequence] = useState<number>(0)

    const formHandleChange = (event: any) => {
        setForm((state) => {
            return { ...state, [event.target.name]: event.target.value }
        })
    }

    const fetchCapture = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        let urls = form.url.split('\n')
        setForm((state) => {
            return { ...state, url: '' }
        })

        // 有効なURLのみ抽出
        urls = urls.filter((url: string) => {
            try {
                const uri = new URL(url)
                if (!new URL(url).hostname) {
                    return false
                }
            } catch (error) {
                return false
            }
            return true
        })

        let sequence: number = 0
        let list: capture[] = []
        list = urls.map((url: string) => {
            sequence++
            const id = captureSequence + sequence
            const random = Math.random().toString(32).substring(2)
            return {
                id,
                url,
                checked: false,
                imageName: `${id}_${random}.${imageType}`,
                imageUrl: null,
                imageBlob: null,
                errorMessage: null,
            }
        })
        setCaptureList((state) => [...state, ...list])
        setCaptureSequence((state) => state + sequence)

        for(const index in list) {
            const capture = list[index]
            const { data, error } = await axios
                .get(
                    '/api/capture?' +
                        ('&type=' + imageType) +
                        ('&width=' + form.width) +
                        ('&height=' + form.height) +
                        ('&scale=' + form.scale) +
                        ('&url=' + encodeURIComponent(capture.url)),
                    {
                        responseType: 'blob',
                    }
                )
                .then((response) => {
                    return { ...response, error: null }
                })
                .catch((error) => {
                    return { data: null, error }
                })
            setCaptureList((state) => {
                return state.map((item: capture) => {
                    if (item.id !== capture.id) {
                        return item
                    }
                    return error
                        ? {
                              ...item,
                              errorMessage:
                                  'エラーが発生しました。ステータスコード：' +
                                  error.response.status,
                          }
                        : {
                              ...item,
                              imageUrl: URL.createObjectURL(data),
                              imageBlob: data,
                          }
                })
            })
        }
    }

    const allCheckHandleClick = (event: any) => {
        setCaptureList(
            captureList.map((capture: capture) => {
                return {
                    ...capture,
                    checked: event.target.checked,
                }
            })
        )
    }

    const captureCheck = (event: any, captureId: number) => {
        setCaptureList((state) =>
            state.map((capture: capture) => {
                if (capture.id !== captureId) {
                    return capture
                }
                return {
                    ...capture,
                    checked: event.target.checked,
                }
            })
        )
    }

    const capturePreview = (imageUrl: string) => {
        setModalImage(imageUrl)
        setModalOpen(true)
    }

    const captureDelete = (captureId: number) => {
        setCaptureList((state) =>
            state.filter((capture: capture) => {
                if (capture.id === captureId) {
                    if (capture.imageBlob) {
                        URL.revokeObjectURL(capture.imageBlob)
                    }
                    return false
                }
                return true
            })
        )
    }

    const allCaptureDLDisabled = () => {
        const checkList = captureList.filter((capture: capture) => capture.checked)
        const notFoundImage = !!checkList.find((capture: capture) => !capture.imageUrl)
        return checkList.length == 0 || notFoundImage
    }

    const allCaptureDLHandleClick = async () => {
        const zip = new JSZip()
        const folder = zip.folder('url-captures')!
        captureList.map((capture: capture) => {
            if (!capture.imageBlob) {
                return
            }
            if (!capture.checked) {
                return
            }
            folder.file(capture.imageName, capture.imageBlob)
        })
        const content = await zip.generateAsync({ type: 'blob' })
        window.open(URL.createObjectURL(content), '_blank')
    }

    return (
        <Layout>
            <Box component="form" onSubmit={fetchCapture}>
                <TextField
                    name="url"
                    label="URLs"
                    multiline
                    fullWidth
                    value={form.url}
                    minRows={6}
                    onChange={formHandleChange}
                    helperText="改行して入力できます"
                />
                <FormGroup row sx={{ mt: 1 }}>
                    <TextField
                        name="width"
                        label="width"
                        value={form.width}
                        onChange={formHandleChange}
                        inputProps={{ type: 'number', min: 1, max: 2000 }}
                        sx={{ mt: 2, mr: 2, width: 200 }}
                    />
                    <TextField
                        name="height"
                        label="height"
                        value={form.height}
                        onChange={formHandleChange}
                        inputProps={{ type: 'number', min: 1, max: 4000 }}
                        sx={{ mt: 2, mr: 2, width: 200 }}
                    />
                    <FormControl sx={{ mt: 2, mr: 2, width: 140 }}>
                        <InputLabel>scale</InputLabel>
                        <Select
                            name="scale"
                            label="スケール"
                            value={form.scale}
                            onChange={formHandleChange}
                        >
                            {scales.map((scale: scale) => (
                                <MenuItem key={scale.value} value={scale.value}>
                                    {scale.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </FormGroup>

                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    キャプチャ取得
                </Button>
            </Box>

            <Typography variant="h3" sx={{ mt: 6 }}>
                キャプチャ一覧
            </Typography>
            <List
                sx={{ mt: 4 }}
                subheader={
                    <>
                        <ListSubheader
                            sx={{ display: 'flex', alignItems: 'center' }}
                            disableGutters
                        >
                            <ListItemIcon>
                                <Checkbox onClick={allCheckHandleClick} />
                            </ListItemIcon>
                            <ListItemText>URL</ListItemText>
                            <ListItemText sx={{ px: 1, flexGrow: 0, width: 40 }}>PV</ListItemText>
                            <ListItemText sx={{ px: 1, flexGrow: 0, width: 40 }}>DL</ListItemText>
                            <ListItemText sx={{ flexGrow: 0, width: 40 }}></ListItemText>
                        </ListSubheader>
                        <Divider />
                    </>
                }
            >
                {captureList.map((capture: capture, index: number) => (
                    <ListItem key={capture.id} divider={true} disableGutters>
                        <ListItemIcon sx={{ minWidth: 'auto' }}>
                            <Checkbox
                                checked={capture.checked}
                                onChange={(event) => {
                                    captureCheck(event, capture.id)
                                }}
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary={capture.url}
                            secondary={capture.errorMessage}
                            secondaryTypographyProps={{
                                color: 'error.main',
                            }}
                            sx={{ wordBreak: 'break-all' }}
                        ></ListItemText>
                        <ListItemIcon sx={{ minWidth: 'auto' }}>
                            <IconButton
                                disabled={!capture.imageUrl}
                                onClick={() => {
                                    capturePreview(capture.imageUrl!)
                                }}
                            >
                                <ZoomInIcon />
                            </IconButton>
                        </ListItemIcon>
                        <ListItemIcon sx={{ minWidth: 'auto' }}>
                            {capture.errorMessage ? (
                                <IconButton disabled>
                                    <ErrorIcon color="error" />
                                </IconButton>
                            ) : (
                                <>
                                    {!capture.imageUrl ? (
                                        <CircularProgress size={24} sx={{ m: 1 }} />
                                    ) : (
                                        <IconButton
                                            href={capture.imageUrl}
                                            download={capture.imageName}
                                        >
                                            <DownloadIcon />
                                        </IconButton>
                                    )}
                                </>
                            )}
                        </ListItemIcon>
                        <ListItemIcon sx={{ minWidth: 'auto' }}>
                            <IconButton
                                onClick={() => {
                                    captureDelete(capture.id)
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </ListItemIcon>
                    </ListItem>
                ))}
            </List>

            <Button
                variant="contained"
                disabled={allCaptureDLDisabled()}
                onClick={allCaptureDLHandleClick}
                sx={{ mt: 1 }}
            >
                まとめてDL
            </Button>

            <Modal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false)
                }}
            >
                <Card
                    component="img"
                    src={modalImage}
                    sx={{
                        position: 'absolute',
                        maxWidth: '90%',
                        maxHeight: '90%',
                        m: 'auto',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        imageRendering: '-webkit-optimize-contrast',
                    }}
                ></Card>
            </Modal>
        </Layout>
    )
}

export default Home
