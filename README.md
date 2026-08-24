# BD চাকরির পাঠশালা

বাংলাদেশের চাকরিপ্রার্থীদের জন্য প্রশ্ন-উত্তর, বিষয়ভিত্তিক MCQ, মডেল টেস্ট এবং চাকরির তথ্যের স্ট্যাটিক ওয়েবসাইট।

**Website:** https://bdchakrirpathshala.com/

## GitHub Pages-এ প্রকাশ

1. GitHub-এ একটি নতুন repository তৈরি করুন।
2. এই ফোল্ডারের সব ফাইল ও `css/`, `js/` ফোল্ডার upload করুন।
3. Repository → **Settings → Pages** এ যান।
4. **Deploy from a branch** নির্বাচন করে `main` branch এবং `/ (root)` নির্বাচন করুন।
5. এই repository-তে থাকা `CNAME` ফাইলের কারণে custom domain হিসেবে `bdchakrirpathshala.com` ব্যবহার করা যাবে।
6. আপনার domain registrar-এর DNS-এ GitHub Pages-এর জন্য প্রয়োজনীয় DNS record সেট করুন।

> DNS record আপনার domain registrar অনুযায়ী আলাদা হতে পারে। GitHub Pages-এর Custom domain সেটিংসে দেখানো নির্দেশনাই অনুসরণ করুন।

## প্রশ্ন যোগ করা

`js/data.js`-এর `questionsData` array-তে নতুন question object যোগ করুন। প্রতিটি প্রশ্নের `id` আলাদা রাখুন।

## ফাইল কাঠামো

```text
BD-Chakrir-Pathshala/
├── index.html
├── recent.html
├── questions.html
├── category.html
├── model-test.html
├── news.html
├── about.html
├── contact.html
├── 404.html
├── CNAME
├── robots.txt
├── sitemap.xml
├── README.md
├── css/
│   └── style.css
└── js/
    ├── data.js
    ├── main.js
    └── quiz.js
```

## গুরুত্বপূর্ণ

এটি একটি static site। Contact form চালাতে Formspree/EmailJS বা নিজস্ব backend প্রয়োজন হবে। বর্তমান version-এ কোনো fake email address রাখা হয়নি।
