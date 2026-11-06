import os
import glob
import re
import json

docs_dir = '/home/bezerk/Documents/dev/work/hitha/hitha-docs/docs'
out_file = '/home/bezerk/Documents/dev/work/hitha/hitha-docs/src/data/searchCatalog.json'

os.makedirs('/home/bezerk/Documents/dev/work/hitha/hitha-docs/src/data', exist_ok=True)

catalog = []
files = glob.glob(f"{docs_dir}/**/*.md", recursive=True)

for fpath in files:
    rel = os.path.relpath(fpath, docs_dir)
    route = '/docs/' + rel.replace('.md', '').replace('/index', '')
    if route.endswith('/intro'):
        route = '/docs/'
        
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Extract title
    title_m = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    title = title_m.group(1).strip() if title_m else rel
    
    # Category
    parts = rel.split('/')
    category = parts[0].replace('-', ' ').title() if len(parts) > 1 else 'Overview'
    
    # Extract headings (h2, h3)
    headings = []
    for h in re.finditer(r'^(#{2,3})\s+(.+)$', content, re.MULTILINE):
        h_title = h.group(2).strip()
        slug = re.sub(r'[^\w\s-]', '', h_title.lower()).strip().replace(' ', '-')
        headings.append({
            'title': h_title,
            'slug': slug,
            'url': f"{route}#{slug}"
        })
        
    # Clean markdown formatting for preview
    clean_text = re.sub(r'```[\s\S]*?```', '', content)
    clean_text = re.sub(r'[#\*`_\-\[\]\(\)]', ' ', clean_text)
    clean_text = ' '.join(clean_text.split()[:160])
    
    catalog.append({
        'id': rel.replace('.md', ''),
        'title': title,
        'category': category,
        'route': route,
        'headings': headings[:6],
        'preview': clean_text,
    })

catalog.sort(key=lambda x: (x['category'], x['title']))

with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

print(f"Generated {len(catalog)} search items in {out_file}")
