import React from "react"
import { Box, Button, Chip, Grid, Stack, Typography } from "@mui/material"
import { styled } from "@mui/styles"
import { palette, typography } from "../../theme"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { Article } from "../../models/publication"
import EditIcon from "@mui/icons-material/Edit"
import { shortTitle } from "../../utils/string"
import moment from "moment"
import { usePublicationContext } from "../../services/publications/contexts"
import { useNavigate } from "react-router-dom"

const PostItemContainer = styled(Box)({
  minHeight: "105px",
  background: palette.grays[100],
  borderRadius: 4,
  cursor: "pointer",
  padding: 20,
  "&:hover": {
    background: palette.grays[200],
    "& .arrow-forward": {
      color: palette.grays[600],
    },
  },
})

const PostItemEditButton = styled(Button)({
  border: `2px solid ${palette.grays[400]}`,
  background: palette.whites[400],
  color: palette.grays[800],
  "&:hover": {
    background: palette.whites[1000],
  },
})

const ThumbnailImage = styled("img")({
  borderRadius: 4,
  height: "calc(100% - 2px)",
  objectFit: "cover",
})

type PostItemProps = {
  article: Article
  couldUpdate: boolean
}
const PostItem: React.FC<PostItemProps> = ({ article, couldUpdate }) => {
  const navigate = useNavigate()
  const { saveArticle } = usePublicationContext()
  const { description, image, title, tags, lastUpdated, id } = article
  const articleTitle = shortTitle(title, 30)
  const articleDescription = description && shortTitle(description, 165)
  const date = lastUpdated && new Date(parseInt(lastUpdated) * 1000)
  const publicationId = article.publication?.id
  return (
    <PostItemContainer
      onClick={() => {
        navigate(`/publication/${publicationId}/article/${id}`)
        saveArticle(article)
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={4}>
          {image && (
            <ThumbnailImage src={`https://ipfs.infura.io/ipfs/${image}`}/>
          )}
        </Grid>
        <Grid item xs={8}>
          <Typography fontFamily={typography.fontFamilies.sans} variant="subtitle1" fontWeight={600}>
            {articleTitle}
          </Typography>
          <Stack alignItems="center" direction="row" spacing={2}>
            {date && <Typography variant="body2">{moment(date).format("MMMM DD, YYYY")}</Typography>}
            <Stack alignItems="center" direction="row" spacing={1}>
              {tags && tags.length > 0 && tags.map((tag, index) => <Chip label={tag} size="small" key={index} />)}
            </Stack>
          </Stack>
          <Typography
            variant="body1"
            sx={{
              color: palette.grays[900],
              fontSize: 14,
              lineHeight: 1.5,
              mt: 1,
            }}
          >
            {articleDescription}
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{height: 2, width: "100%", my: 1, bgcolor: palette.grays[200]}}/>

      <Box alignItems="center" display="flex" justifyContent="space-between">
        <Box>
          {couldUpdate && (
            <PostItemEditButton
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/publication/post-action/edit`)
                saveArticle(article)
              }}
              variant="contained"
              size="small"
              startIcon={<EditIcon sx={{ width: 16, height: 16 }} />}
            >
                Edit Post
            </PostItemEditButton>
          )}
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="small"
          endIcon={<ArrowForwardIosIcon sx={{ width: 16, height: 16 }}/>}
        >
          Continue Reading
        </Button>
      </Box>
    </PostItemContainer>
  )
}

export default PostItem
