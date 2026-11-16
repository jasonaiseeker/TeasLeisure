const image = (name) => `/static/demo/${name}.svg`;

export const demoStalls = [
	{ id: 101, name: '阿婆手作糯米糍', categoryId: 1, categoryName: '小吃美食', description: '每天现做的软糯糯米糍，花生、芝麻和芒果三种口味。', coverImage: image('stall-snacks'), imageUrls: `${image('stall-snacks')},${image('stall-fruit')}`, cityName: '杭州市', districtName: '拱墅区', address: '运河广场东侧步行街', businessHours: '16:30–22:00', todayStatusKnown: true, openToday: true, todayHours: '16:30–22:00', currentOpen: true, latitude: 30.3191, longitude: 120.1417, ownerName: '林阿姨', favoriteCount: 128, viewCount: 932 },
	{ id: 102, name: '晚风柠檬茶', categoryId: 2, categoryName: '饮品甜品', description: '手打香水柠檬，少糖也清爽。周末有桂花限定。', coverImage: image('stall-drink'), imageUrls: image('stall-drink'), cityName: '杭州市', districtName: '拱墅区', address: '武林夜市 3 号摊位', businessHours: '17:00–23:30', todayStatusKnown: true, openToday: true, todayHours: '17:00–23:30', currentOpen: true, latitude: 30.2764, longitude: 120.1619, ownerName: '小周', favoriteCount: 86, viewCount: 681 },
	{ id: 103, name: '旧物新生手作摊', categoryId: 3, categoryName: '手作好物', description: '旧布料编织的小包、杯垫和钥匙扣，每件都不一样。', coverImage: image('stall-craft'), imageUrls: image('stall-craft'), cityName: '杭州市', districtName: '上城区', address: '湖滨步行街南口', businessHours: '周五至周日 15:00–21:30', todayStatusKnown: true, openToday: true, todayHours: '15:00–21:30', currentOpen: false, latitude: 30.2517, longitude: 120.1683, ownerName: '小满', favoriteCount: 64, viewCount: 477 }
];

export const demoPosts = [
	{ id: 201, stallId: 101, stallName: demoStalls[0].name, stallAddress: demoStalls[0].address, content: '今天的芒果糯米糍刚出炉，路过运河广场可以来尝尝。', imageUrls: image('stall-snacks'), authorName: '林阿姨', authorAvatar: '/static/images/def_avatar.png', likeCount: 32, commentCount: 8, liked: false, createTime: '今天 16:42' },
	{ id: 202, stallId: 102, stallName: demoStalls[1].name, stallAddress: demoStalls[1].address, content: '晚风和一杯手打柠檬茶，今天营业到 23:30。', imageUrls: image('stall-drink'), authorName: '小周', authorAvatar: '/static/images/def_avatar.png', likeCount: 21, commentCount: 5, liked: false, createTime: '今天 17:08' },
	{ id: 203, stallId: 103, stallName: demoStalls[2].name, stallAddress: demoStalls[2].address, content: '把喜欢的旧花布做成随身小物，周末湖滨见。', imageUrls: image('stall-craft'), authorName: '小满', authorAvatar: '/static/images/def_avatar.png', likeCount: 18, commentCount: 3, liked: false, createTime: '昨天 19:20' }
];

const categories = [
	{ id: 1, name: '小吃美食' }, { id: 2, name: '饮品甜品' }, { id: 3, name: '手作好物' }, { id: 4, name: '花艺绿植' }, { id: 5, name: '生活服务' }, { id: 6, name: '其他' }
];
const cityTree = [{ cityId: 330000, name: '浙江省', child: [{ cityId: 330100, name: '杭州市', child: [{ cityId: 330105, name: '拱墅区' }, { cityId: 330102, name: '上城区' }] }] }];

const sampleComments = [
	{ id: 301, postId: 201, authorName: '周末逛逛', content: '上次买过，花生味真的很香！', createTime: '今天 17:02', mine: false },
	{ id: 302, postId: 201, authorName: '小鹿同学', content: '请问今天几点收摊？', createTime: '今天 17:16', mine: false },
	{ id: 303, postId: 202, authorName: '阿哲', content: '少糖版本很适合晚上喝。', createTime: '今天 17:30', mine: false }
];

export function isDemoRequestEnabled() {
	return import.meta.env.DEV && import.meta.env.VITE_TL_DEMO_MODE === 'true';
}

export function demoRequest(url, method = 'GET', data = {}) {
	const path = url.split('?')[0];
	const query = Object.fromEntries(new URLSearchParams(url.split('?')[1] || ''));
	const body = { ...(query || {}), ...(data || {}) };
	let payload;
	if (path === 'city/list') payload = cityTree;
	else if (path === 'tl/categories') payload = categories;
	else if (path === 'tl/stalls') {
		let items = demoStalls.filter((stall) => !body.keyword || `${stall.name}${stall.description}`.includes(body.keyword));
		if (body.categoryId) items = items.filter((stall) => stall.categoryId === Number(body.categoryId));
		payload = paged(items, body);
	} else if (/^tl\/stalls\/\d+$/.test(path)) {
		payload = demoStalls.find((stall) => stall.id === Number(path.split('/').pop())) || demoStalls[0];
	} else if (path === 'tl/community/posts') {
		let items = demoPosts.filter((post) => !body.stallId || post.stallId === Number(body.stallId));
		if (body.categoryId) items = items.filter((post) => demoStalls.find((stall) => stall.id === post.stallId)?.categoryId === Number(body.categoryId));
		payload = paged(items, body);
	} else if (/^tl\/community\/posts\/\d+$/.test(path)) {
		payload = demoPosts.find((post) => post.id === Number(path.split('/').pop())) || demoPosts[0];
	} else if (/^tl\/community\/posts\/\d+\/comments$/.test(path)) {
		const postId = Number(path.split('/')[3]);
		payload = paged(sampleComments.filter((comment) => comment.postId === postId || postId === 201), body);
	} else payload = {};
	return Promise.resolve({ code: 200, message: 'demo', data: payload });
}

function paged(items, params = {}) {
	const page = Math.max(1, Number(params.page || 1));
	const limit = Math.max(1, Number(params.limit || 20));
	return { list: items.slice((page - 1) * limit, page * limit), total: items.length, totalPage: Math.ceil(items.length / limit) };
}
