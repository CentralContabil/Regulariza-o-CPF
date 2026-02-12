import { useState, useEffect } from 'react'

export function useContent() {
  const [content, setContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch('/api/content')
        const data = await response.json()
        setContent(data)
      } catch (error) {
        console.error('Erro ao buscar conteúdo:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [])

  return { content, isLoading }
}
