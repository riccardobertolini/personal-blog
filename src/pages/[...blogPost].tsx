import { GetStaticPaths, NextPage } from 'next';
import {  Document } from '@contentful/rich-text-types';
import client from '../lib/contentful';

interface BlogPostFields {
    title: string;
    content: Document;
    date: string;
    fields: [slug:string]
}

interface Props {
    blogPost: BlogPostFields;
}

const BlogPostPage: NextPage<Props> = ({ blogPost }) => {
    return (
        <div>
            <h1>{blogPost.title}</h1>
        </div>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    // @ts-ignore
    const { items } = await client.getEntries<BlogPostFields>({
        content_type: 'blogPost',
    });

    const paths = items.map((item) => ({
        params: { blogPost: item.fields.slug.split('/') },
    }));

    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: ({params}: { params: any }) => Promise<{ notFound: boolean } | {
    props: {
        blogPost: {
            // @ts-ignore
            [p: string]: ResolvedField<BlogPostFields["fields"][string], undefined, string>;
        }
    }
}> = async ({ params }) => {
    const blogPostSlug = params?.blogPost;

    if (!blogPostSlug || !Array.isArray(blogPostSlug)) {
        return {
            notFound: true,
        };
    }

    const slug = blogPostSlug.join('/');

    // @ts-ignore
    const { items } = await client.getEntries<BlogPostFields>({
        content_type: 'blogPost',
        'fields.slug': slug,
        limit: 1,
    });

    if (items.length === 0) {
        return {
            notFound: true,
        };
    }

    const [post] = items.map((item) => item.fields);

    return {
        props: {
            blogPost: post,
        },
    };
};

export default BlogPostPage;
