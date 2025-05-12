// import { Suspense } from 'react'
import { fetchItems, getNewItems, getTrendingItems } from '@/lib/google-sheets'
// import { SearchBar } from '@/components/search-bar'
import { GridView } from '@/components/grid-view'
import { SiteHeader } from '@/components/site-header'
import { getCurrentUser, getUserPreferences } from '@/lib/supabase'
import { contentsForLanguage } from '@/lib/contents'
import { Item } from '@/lib/types'
import Markdown from 'react-markdown'

interface HomePageProps {
  searchParams: Promise<{
    q?: string
    item?: string
  }>
}

export default async function Home(props: HomePageProps) {
  const contents = await contentsForLanguage('en')

  // Get search query from URL
  const sParams = await props.searchParams
  const searchQuery = sParams.q?.toLowerCase() || ''
  const selectedItemId = sParams.item || null

  // Fetch data from Google Sheets with ISR
  const { items } = await fetchItems()

  // Get new and trending items
  const newItems = getNewItems(items)
  const trendingItems = getTrendingItems(items)

  // Filter items based on search query
  const filteredItems = searchQuery
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery) ||
          item.description.toLowerCase().includes(searchQuery) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
      )
    : items

  // Get current user
  const user = await getCurrentUser()

  // Get user preferences
  let userLikes: string[] = []
  let userBookmarks: string[] = []

  if (user) {
    const { data } = await getUserPreferences(user.id)
    userLikes = data?.likes || []
    userBookmarks = data?.bookmarks || []
  }

  const sections = Object.keys(contents).reduce(
    (acc, key) => {
      if (key.startsWith('sectionTitle')) {
        const title = contents[key]
        const sectionKey = key.replace('sectionTitle', '')
        const contentKey = `sectionContent${sectionKey}`
        acc.push({
          title,
          content: contents[contentKey],
        })
      }
      return acc
    },
    [] as { title: string; content: string }[]
  )
  return (
    <>
      <SiteHeader user={user} title={contents['landingTitle']} />

      <main className="container w-full space-y-4 px-4 py-6 md:py-10">
        <div className="mb-10">
          <h1 className="lg:text-12xl mb-2 scroll-m-20 text-9xl font-bold tracking-tight">
            {contents['landingTitle']}
          </h1>
          <div className="max-w-3xl text-xl text-muted-foreground">
            {contents['landingHeroDescription']}
          </div>
        </div>

        {/* TODO: Search */}
        {/* <Suspense fallback={<div>Loading search...</div>}>
          <SearchBar initialQuery={searchQuery} />
        </Suspense> */}

        {searchQuery ? (
          <ItemSection
            title={`Search Results for "${searchQuery}"`}
            items={filteredItems}
            userLikes={userLikes}
            userBookmarks={userBookmarks}
            selectedItemId={selectedItemId}
            userId={user?.id}
          />
        ) : (
          <>
            {[
              { title: 'New Developer Tools & Resources', items: newItems },
              { title: 'Trending Development Tools', items: trendingItems },
              { title: 'Explore All Coding & Development Resources', items: items },
            ].map(({ title, items }) => {
              if (items.length === 0) return null
              return (
                <ItemSection
                  key={title}
                  title={title}
                  items={items}
                  userLikes={userLikes}
                  userBookmarks={userBookmarks}
                  selectedItemId={selectedItemId}
                  userId={user?.id}
                />
              )
            })}
          </>
        )}
        {sections.map(({ title, content }) => (
          <div key={title} className="w-full space-y-4">
            <h2 id="what-is-vibe-coding" className="text-center text-2xl font-semibold">
              {title}
            </h2>
            <div className="markdown-body mx-auto max-w-5xl">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        ))}
      </main>
    </>
  )
}

const ItemSection = ({
  title,
  items,
  userLikes,
  userBookmarks,
  selectedItemId,
  userId,
}: {
  title: string
  items: Item[]
  userLikes: string[]
  userBookmarks: string[]
  selectedItemId: string | null
  userId?: string | null
}) => {
  return (
    <div className="space-y-4 py-12">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <GridView
        items={items}
        userId={userId}
        userLikes={userLikes}
        userBookmarks={userBookmarks}
        initialSelectedId={selectedItemId}
      />
    </div>
  )
}
