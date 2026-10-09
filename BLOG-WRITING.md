# Markdown으로 블로그 관리하기

이 사이트의 글은 `posts/<slug>/index.md`가 원본입니다. `posts/posts.json`에서 카드 제목, 소개, 분류, 표지를 관리합니다. `main`에 push하면 기존 GitHub Pages workflow가 Markdown과 수식을 정적 HTML로 변환해 배포합니다.

GitHub 저장소의 **Settings → Pages → Build and deployment → Source**는 **GitHub Actions**로 설정되어 있습니다. `.github/workflows/static.yml`이 생성한 `_site/`가 배포 대상입니다. 저장소를 새로 만들거나 Pages 설정을 복원할 때도 이 Source를 사용합니다.

## 기존 글 수정

1. `posts/<slug>/index.md`를 수정합니다. 첫 줄의 제목은 `posts/posts.json`의 해당 `title`과 일치해야 합니다.
2. 그림은 같은 폴더의 `assets/`에 넣고 `![설명](assets/filename.png)`으로 연결합니다.
3. 변경 사항을 commit하고 `main`에 push합니다. 읽기 페이지 HTML을 직접 고칠 필요가 없습니다.

## 새 글 추가

1. 영문 소문자·숫자·하이픈으로 이루어진 새 slug를 정합니다.
2. `posts/<slug>/index.md`와 `posts/<slug>/assets/`를 만듭니다.
3. `posts/posts.json`에 `slug`, `title`, `category`, `description`, `cover`, `coverAlt`를 추가합니다. JSON 배열 순서가 My Blog 카드 순서입니다. 표지는 저장소 내 이미지 경로를 사용합니다.
4. `.md`의 첫 줄은 `# 제목`으로 시작합니다. `##` 소제목은 목차로, Markdown 표는 모바일에서 가로 스크롤 가능한 표로 변환됩니다. `$$`를 각기 한 줄에 적은 수식 블록과 `$...$` 인라인 수식은 KaTeX로 조판됩니다.
5. 그림 바로 뒤에 `*Figure 1. 설명 및 출처.*` 문단을 넣으면 이미지 캡션으로 표시됩니다. 논문 인용과 출처 링크를 유지합니다.

날짜는 임의로 부여하지 않았습니다. 현재 카드와 글에는 실제 작성자 이름과 본문 길이에서 계산한 읽기 시간만 표시합니다.

## 로컬 확인

Node.js 24 이상과 pnpm 11.25.0을 사용합니다.

```sh
pnpm install --frozen-lockfile
pnpm build
python -m http.server 8000 --directory _site
```

브라우저에서 `http://localhost:8000/blog.html`을 열면 됩니다. 생성 결과는 `_site/`에 있으며 Git에 포함하지 않습니다. 루트 `blog.html`도 같은 빌드에서 갱신됩니다. 글의 실제 읽기 경로는 `blog/<slug>/`입니다.

글·수식·목차 링크는 미리 생성되므로 JavaScript가 꺼져 있어도 읽을 수 있습니다. JavaScript는 모바일 메뉴, 접이식 목차, 읽기 진행 표시, 그림 확대만 보완합니다. KaTeX CSS와 글꼴도 사이트에 함께 배포합니다. `PUBLISHING-NOTES.md`, 원본 PDF, 개인 경로는 공개 글에 복사하지 않습니다.
