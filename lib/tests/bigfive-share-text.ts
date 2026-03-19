/**
 * BigFive Share Text Generator
 *
 * This module generates social media share text for BigFive test results.
 * Designed for Twitter/X with 140-200 character limit.
 */

import type { BigFiveType } from '@/data/tests/bigfive-types'

/**
 * Generate Twitter/X share text for a personality type
 *
 * Format:
 * ```
 * 私の性格診断結果は「{タイプ名}」でした！
 *
 * ✅ {強み1}
 * ✅ {強み2}
 * ✅ {強み3}
 *
 * 確かに当たってる！
 * あなたの結果は？
 *
 * #性格診断 #自己理解 #BigFive
 * {URL}
 * ```
 *
 * @param type The personality type
 * @param resultUrl The result page URL
 * @returns Share text (140-200 characters)
 */
export function generateShareText(type: BigFiveType, resultUrl: string): string {
  // Build the share text components
  const intro = `私の性格診断結果は「${type.name}」でした！`

  const strengths = type.strengths
    .map(strength => `✅ ${strength}`)
    .join('\n')

  const reaction = '確かに当たってる！'
  const cta = 'あなたの結果は？診断してみてください！'

  const hashtags = '#性格診断 #自己理解 #BigFive'

  // Always include URL (use placeholder if empty)
  const url = resultUrl || 'https://personality-platform.com'

  // Build base text with all components
  let parts = [intro, '', strengths, '', reaction, cta, '', hashtags, url]
  let text = parts.join('\n')

  // If too long (> 200), remove reaction
  if (text.length > 200) {
    parts = [intro, '', strengths, '', cta, '', hashtags, url]
    text = parts.join('\n')
  }

  // If still too long, shorten CTA
  if (text.length > 200) {
    const shortCta = 'あなたの結果は？'
    parts = [intro, '', strengths, '', shortCta, '', hashtags, url]
    text = parts.join('\n')
  }

  // If still too long, remove URL
  if (text.length > 200) {
    const shortCta = 'あなたの結果は？'
    parts = [intro, '', strengths, '', shortCta, '', hashtags]
    text = parts.join('\n')
  }

  // If too short (< 140), add more content
  if (text.length < 140) {
    // Add reaction if not present
    const longCta = 'あなたの結果は？診断してみてください！'
    parts = [intro, '', strengths, '', reaction, longCta, '', hashtags]
    if (url && parts.join('\n').length + url.length + 1 <= 200) {
      parts.push(url)
    }
    text = parts.join('\n')
  }

  // Final check: ensure minimum length by adding filler if needed
  while (text.length < 140) {
    // Add various fillers to reach minimum length
    const fillers = [
      '\n性格診断で自分を知ろう！',
      '\n新しい発見があるかも。',
      '\n診断結果を友達と比較してみよう！'
    ]

    let added = false
    for (const filler of fillers) {
      if (text.length + filler.length <= 200 && text.length < 140) {
        text += filler
        added = true
      }
    }

    // If we can't add any more fillers, break to avoid infinite loop
    if (!added) {
      break
    }
  }

  return text
}

/**
 * Get a random reaction phrase for variety
 * (Future enhancement: randomize reactions)
 */
export function getReactionPhrase(): string {
  const phrases = [
    '確かに当たってる！',
    '意外な結果...',
    '納得です'
  ]
  return phrases[0] // For now, always use the first one for determinism
}
