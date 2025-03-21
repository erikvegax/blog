import matter from 'gray-matter';
import { join } from 'path';
import fs from 'fs';

// @ts-ignore
import { Jimp, intToRGBA } from "jimp";

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
		.sort((post1, post2) => (Date.parse(post1.date) < Date.parse(post2.date) ? 1 : -1));

	return posts;
}

export function getPostsByTag(tag: string, fields: string[]): Items[] {
	// add paths for getting all posts
	const filePaths = getPostsFilePaths();
	// get the posts from the filepaths with the matching tag sorted by date
	const posts = filePaths
		.map(filePath => getPostItems(filePath, fields))
		.filter(post => post.tags.includes(tag))
		.sort((post1, post2) => (Date.parse(post1.date) < Date.parse(post2.date) ? 1 : -1));

	return posts;
}

export async function imageToAscii(imagePath: string): Promise<string> {
	const image = await Jimp.read(imagePath);
	image.resize({w: 70});
	image.greyscale();

	const asciiChars = '@%#*+=-:. ';
	let asciiArt = '';

	for (let y = 0; y < image.bitmap.height; y++) {
		for (let x = 0; x < image.bitmap.width; x++) {
			const pixelColor = image.getPixelColor(x, y);
			const brightness = intToRGBA(pixelColor).r;
			const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
			asciiArt += asciiChars[charIndex];
		}
		asciiArt += '\n';
	}

	console.log(asciiArt);

	return asciiArt;
}