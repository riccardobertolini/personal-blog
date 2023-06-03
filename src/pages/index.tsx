import {  NextPage } from 'next';
import client from '../lib/contentful';
import {ResolvedField} from "contentful";
import ReactMarkdown from "react-markdown";

interface PostFields {
    title: string;
    subtext: string;
}

interface Props {
    posts: PostFields[];
}

const HomePage: NextPage<Props> = ({ posts }) => {
    console.log('posts', posts)
    return (
        <div>
            <h1>My Blog</h1>
            {posts.map((post) => (
                <div key={post?.title}>
                    <h2>{post?.title}</h2>
                    <ReactMarkdown children={post?.subtext} />
                </div>
            ))}
        </div>
    );
};

export const getStaticProps: () => Promise<{
    props: {
        posts: {
            // @ts-ignore
            [p: string]: ResolvedField<PostFields['fields'][string], undefined, string>;
        }[]
    }
}> = async () => {
    // @ts-ignore
    const { items } = await client.getEntries<PostFields>({
        content_type: 'homepage',
    });

    // @ts-ignore
    const posts = items.map((item) => item?.fields);

    return {
        props: {
            posts,
        },
    };
};

export default HomePage;
