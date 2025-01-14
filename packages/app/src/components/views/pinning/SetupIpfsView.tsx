import React, { useRef, useState } from "react"
import { Box, Grid, Typography, styled, TextField, FormHelperText, Divider, Button, Modal } from "@mui/material"
import { ExternalLink } from "../../commons/ExternalLink"
import { useNavigate } from "react-router-dom"
import { palette, typography } from "../../../theme"
import { ViewContainer } from "../../commons/ViewContainer"
import Page from "../../layout/Page"
import CloseIcon from "@mui/icons-material/Close"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { Controller, useForm } from "react-hook-form"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import { Pinning } from "../../../models/pinning"
import useLocalStorage from "../../../hooks/useLocalStorage"
import { usePublicationContext } from "../../../services/publications/contexts"
import { useNotification } from "../../../hooks/useNotification"

// const IpfsSpan = styled("span")({
//   color: palette.primary[1000],
//   cursor: "pointer",
//   textDecoration: "underline",
//   "&:hover": {
//     color: palette.primary[800],
//   }
// })
const ModalContainer = styled(ViewContainer)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: 8,
  width: 550,
  background: palette.whites[1000],
  padding: 24,
})

const ModalContentContainer = styled(Box)({
  background: palette.secondary[200],
  borderRadius: 4,
  cursor: "pointer",
  padding: 24,
})

const StyledLinkButton = styled(Box)({
  color: palette.secondary[1000],
  textDecoration: "underline",
  cursor: "pointer",
  "&:hover": {
    color: palette.secondary[800],
  },
})

const setupIpfsSchema = yup.object().shape({
  name: yup.string().required(),
  endpoint: yup.string().required(),
  accessToken: yup.string().required(),
})

const SetupIpfsView: React.FC = () => {
  const navigate = useNavigate()
  const ref = useRef(null)
  const openNotification = useNotification()
  const { currentPath, setCurrentPath } = usePublicationContext()
  const [pinning, setPinning] = useLocalStorage<Pinning | undefined>("pinning", undefined)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: pinning,
    resolver: yupResolver(setupIpfsSchema),
  })
  const [showModal, setShowModal] = useState<boolean>(false)

  const onSubmitHandler = (data: Pinning) => {
    setPinning(data)
    openNotification({
      message: "Successfully set up the pinning service!",
      variant: "success",
      autoHideDuration: 5000,
    })
    if (currentPath) {
      navigate(currentPath)
      setCurrentPath(undefined)
      return
    }
    navigate("/publication/publish")
  }

  const handleClose = () => {
    if (currentPath) {
      navigate(currentPath)
      setCurrentPath(undefined)
      return
    }

    if (!currentPath) {
      navigate("/publication/publish")
      return
    }
    if (!currentPath && !showModal) {
      setShowModal(true)
      return
    }
  }

  return (
    <Page>
      <ViewContainer maxWidth="sm">
        <form style={{ width: "100%" }} onSubmit={handleSubmit((data) => onSubmitHandler(data as Pinning))}>
          <Grid container gap={3} mt={19}>
            <Grid item width={"100%"}>
              <Grid container justifyContent="space-between" alignItems={"center"}>
                <Typography fontFamily={typography.fontFamilies.sans} variant="h5" m={0}>
                  Setup Pinning Service
                </Typography>
                <CloseIcon style={{ cursor: "pointer" }} onClick={handleClose} />
              </Grid>
            </Grid>
            <Grid item width={"100%"}>
              <Typography variant="body1">
                You can provide an endpoint to a pinning service in adherence with IPFS&#39;s{" "}
                <ExternalLink link="https://ipfs.github.io/pinning-services-api-spec/">
                  pinning services API spec.
                </ExternalLink>
              </Typography>
            </Grid>

            <Grid item width={"100%"}>
              <Grid container flexDirection="column" justifyContent="center" gap={2}>
                <Grid item>
                  <Grid container flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1" fontWeight="bold" fontFamily={typography.fontFamilies.sans}>
                        Nickname{" "}
                        <Typography component="span" sx={{ color: palette.primary[1000] }}>
                          *
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        control={control}
                        name="name"
                        render={({ field }) => <TextField {...field} placeholder="Pinata" sx={{ width: "100%" }} />}
                        rules={{ required: true }}
                      />
                      {errors && errors.name && (
                        <FormHelperText sx={{ textTransform: "capitalize" }}>
                          Nickname Is A Required Field
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1" fontWeight="bold" fontFamily={typography.fontFamilies.sans}>
                        API endpoint{" "}
                        <Typography component="span" sx={{ color: palette.primary[1000] }}>
                          *
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        control={control}
                        name="endpoint"
                        render={({ field }) => (
                          <TextField {...field} sx={{ width: "100%" }} placeholder="https://api.pinata.cloud/1234" />
                        )}
                        rules={{ required: true }}
                      />
                      {errors && errors.endpoint && (
                        <FormHelperText sx={{ textTransform: "capitalize" }}>
                          API Endpoint Is A Required Field
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1" fontWeight="bold" fontFamily={typography.fontFamilies.sans}>
                        Secret Access Token{" "}
                        <Typography component="span" sx={{ color: palette.primary[1000] }}>
                          *
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        control={control}
                        name="accessToken"
                        render={({ field }) => <TextField {...field} sx={{ width: "100%" }} />}
                        rules={{ required: true }}
                      />
                      {errors && errors.accessToken && (
                        <FormHelperText sx={{ textTransform: "capitalize" }}>
                          Secret Access Token Is A Required Field
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item width={"100%"}>
              <Divider />
            </Grid>
            <Grid item width={"100%"}>
              <Grid container alignItems="center" justifyContent="space-between">
                <StyledLinkButton onClick={() => setShowModal(true)}>Don&#39;t use IPFS</StyledLinkButton>
                <Button variant="contained" type="submit">
                  Continue
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </ViewContainer>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <ModalContainer maxWidth="sm" ref={ref}>
          <Grid container gap={3} py={3} px={4} flexDirection="column">
            <Grid item>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item sx={{ display: "flex", alignItems: "center" }}>
                  <WarningAmberIcon color="secondary" sx={{ marginRight: 1 }} />
                  <Typography
                    fontFamily={typography.fontFamilies.sans}
                    variant="h6"
                    sx={{ margin: 0 }}
                    color={palette.secondary[1000]}
                  >
                    Warning
                  </Typography>
                </Grid>
                <Grid item>
                  <CloseIcon style={{ cursor: "pointer" }} onClick={() => setShowModal(false)} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <ModalContentContainer>
                <Typography variant="body1" fontWeight={700} color={palette.secondary[1000]}>
                  It is not recommended to publish an article without a configured pinning service. Without a configured
                  pinning service, your transactions will be much more expensive.
                </Typography>
              </ModalContentContainer>
            </Grid>
            <Grid item>
              <Divider />
            </Grid>
            <Grid item>
              <StyledLinkButton
                onClick={() => {
                  setPinning(undefined)
                  handleClose()
                }}
              >
                I understand, and I&#39;d like to continue without setting up IPFS.
              </StyledLinkButton>
            </Grid>
          </Grid>
        </ModalContainer>
      </Modal>
    </Page>
  )
}

export default SetupIpfsView
