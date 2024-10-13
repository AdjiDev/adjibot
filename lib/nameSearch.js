const axios = require('axios');
const cheerio = require('cheerio');
const ora = require('ora');

const socialMedia = [
    {"url": "https://www.facebook.com/{}", "name": "Facebook"},
    {"url": "https://www.twitter.com/{}", "name": "Twitter"},
    {"url": "https://www.instagram.com/{}", "name": "Instagram"},
    {"url": "https://www.linkedin.com/in/{}", "name": "LinkedIn"},
    {"url": "https://www.github.com/{}", "name": "GitHub"},
    {"url": "https://www.pinterest.com/{}", "name": "Pinterest"},
    {"url": "https://www.tumblr.com/{}", "name": "Tumblr"},
    {"url": "https://www.youtube.com/@{}", "name": "Youtube"},
    {"url": "https://soundcloud.com/{}", "name": "SoundCloud"},
    {"url": "https://www.snapchat.com/add/{}", "name": "Snapchat"},
    {"url": "https://www.tiktok.com/@{}", "name": "TikTok"},
    {"url": "https://www.behance.net/{}", "name": "Behance"},
    {"url": "https://www.medium.com/@{}", "name": "Medium"},
    {"url": "https://www.quora.com/profile/{}", "name": "Quora"},
    {"url": "https://www.flickr.com/people/{}", "name": "Flickr"},
    {"url": "https://www.periscope.tv/{}", "name": "Periscope"},
    {"url": "https://www.twitch.tv/{}", "name": "Twitch"},
    {"url": "https://www.dribbble.com/{}", "name": "Dribbble"},
    {"url": "https://www.stumbleupon.com/stumbler/{}", "name": "StumbleUpon"},
    {"url": "https://www.ello.co/{}", "name": "Ello"},
    {"url": "https://www.producthunt.com/@{}", "name": "Product Hunt"},
    {"url": "https://www.telegram.me/{}", "name": "Telegram"},
    {"url": "https://www.weheartit.com/{}", "name": "We Heart It"},
    {"url": "https://www.reddit.com/user/{}", "name": "Reddit"},
    {"url": "https://www.deviantart.com/{}", "name": "DeviantArt"},
    {"url": "https://www.vk.com/{}", "name": "VK"},
    {"url": "https://www.soundcloud.com/{}", "name": "SoundCloud"},
    {"url": "https://www.mix.com/{}", "name": "Mix"},
    {"url": "https://www.myspace.com/{}", "name": "MySpace"},
    {"url": "https://www.coub.com/{}", "name": "Coub"},
];

async function findUsernameOnSocialMedia(username) {
    const results = [];

    const axiosInstance = axios.create({ timeout: 5000 });

    const spinner = ora('Searching for username on social media...').start();

    const platformPromises = socialMedia.map(async (platform) => {
        const url = platform.url.replace('{}', username);

        try {
            const response = await axiosInstance.get(url);
            const $ = cheerio.load(response.data);

            if ($('title').text().includes('404') || /not found/i.test($('body').text())) {
                return { type: platform.name, username: username, link: null };
            } else {
                return { type: platform.name, username: username, link: url };
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return { type: platform.name, username: username, link: null };
            } else {
                return { type: platform.name, username: username, link: `Error: ${error.message}` };
            }
        }
    });

    const finalResults = await Promise.all(platformPromises);
    
    spinner.stop();

    return finalResults;
}
