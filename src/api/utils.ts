import matter from 'gray-matter';
import { join } from 'path';
import fs from 'fs';

const POSTS_PATH = join(process.cwd(), 'src/_posts/');

const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

type Items = {
	// each post has a parameter key that takes the value of a string
	[key: string]: string;
};

type Post = {
	data: {
		// each post has a parameter key that takes the value of a string
		[key: string]: string;
	};
	// each post will include the post content associated with its parameter key
	content: string;
};

function getPostsFilePaths(): string[] {
	return (
		// return the mdx file post path
		fs
			.readdirSync(POSTS_PATH)
			// load the post content from the mdx files
			.filter(path => /\.mdx?$/.test(path))
	);
}

export function getPost(slug: string): Post {
	// add path/location to a single post
	const fullPath = join(POSTS_PATH, `${slug}.mdx`);
	// post's content
	const fileContents = fs.readFileSync(fullPath, 'utf-8');
	// get the front matter data and content
	const { data, content } = matter(fileContents);

	// return the front matter data and content
	return { data, content };
}

export function getPostItems(filePath: string, fields: string[] = []): Items {
	// create a slug from the mdx file location
	const slug = filePath.replace(/\.mdx?$/, '');
	// get the front matter data and content
	const { data, content } = getPost(slug);

	const items: Items = {};

	// just load and include the content needed
	fields.forEach(field => {
		// load the slug
		if (field === 'slug') {
			items[field] = slug;
		}
		// load the post content
		if (field === 'content') {
			items[field] = content;
		}
		// check if the above specified field exists on data
		if (data[field]) {
			// verify the fileds has data
			items[field] = data[field];
		}
	});
	// return the post items
	return items;
}

export function getAllPosts(fields: string[]): Items[] {
	// add paths for getting all posts
	const filePaths = getPostsFilePaths();
	// get the posts from the filepaths with the needed fields sorted by date
	const posts = filePaths
		.map(filePath => getPostItems(filePath, fields))
		.sort((post1, post2) => (post1.date > post2.date ? 1 : -1));
	// return the available post
	return posts;
}

export function getPostsByTag(tag: string, fields: string[]): Items[] {
	// add paths for getting all posts
	const filePaths = getPostsFilePaths();
	// get the posts from the filepaths with the matching tag sorted by date
	const posts = filePaths
		.map(filePath => getPostItems(filePath, fields))
		.filter(post => post.tags.includes(tag))
		.sort((post1, post2) => (post1.date > post2.date ? 1 : -1));

	return posts;
}

export function getDisplayDate(parse: string): string {
	var date = new Date(parse);
	const [month, day, year] = [
		months[date.getMonth()],
		date.getDate(),
		date.getFullYear(),
	];
	return `${month} ${day}, ${year}`;
}
