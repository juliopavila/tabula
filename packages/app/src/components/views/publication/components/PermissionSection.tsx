import React from "react"
import { Grid, Typography, Button } from "@mui/material"
import { palette, typography } from "../../../../theme"
import AddIcon from "@mui/icons-material/Add"
import { usePublicationContext } from "../../../../services/publications/contexts"
import PermissionItem from "../../../commons/PermissionItem"
import { useNavigate } from "react-router-dom"
import { haveActionPermission, usersWithPermissions } from "../../../../utils/permission"

import { useWeb3React } from "@web3-react/core"

export const PermissionSection: React.FC = () => {
  const navigate = useNavigate()
  const { account } = useWeb3React()
  const { publication, savePermission } = usePublicationContext()
  const permissions = publication?.permissions || []
  const usersPermissions = usersWithPermissions(permissions)
  const havePermissionToEdit = haveActionPermission(permissions, "publicationPermissions", account || "")
  return (
    <>
      <Grid container justifyContent="space-between" alignItems={"center"} my={4}>
        <Grid item>
          <Typography
            color={palette.grays[1000]}
            variant="h5"
            fontFamily={typography.fontFamilies.sans}
            sx={{ margin: 0 }}
          >
            Permissions
          </Typography>
        </Grid>
        {havePermissionToEdit && (
          <Grid item>
            <Button variant="contained" size="medium" onClick={() => navigate("/publication/permission/new")}>
              <AddIcon style={{ marginRight: 13 }} />
              New Permission
            </Button>
          </Grid>
        )}
      </Grid>
      <Grid container flexDirection="column" alignItems="flex-start" justifyContent={"flex-start"} gap={2}>
        {usersPermissions.length > 0 &&
          usersPermissions.map((permission) => (
            <Grid item sx={{ width: "100%" }} key={permission.id || ""}>
              <PermissionItem
                permission={permission}
                canEdit={havePermissionToEdit}
                onClick={() => {
                  savePermission(permission)
                  navigate("/publication/permission/edit")
                }}
              />
            </Grid>
          ))}
      </Grid>
    </>
  )
}
