export type ArticleEntity = {
    attributes: {
        title,
        slug,
        description,
        cover: {
            data
        }
        products: {
            data
        }
        difficulty: {
            data: {
                attributes
            }
        },
        publishedAt
    }
}