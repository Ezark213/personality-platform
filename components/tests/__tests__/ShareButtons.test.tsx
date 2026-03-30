import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ShareButtons from '../ShareButtons';

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockWindowOpen,
});

// Mock navigator.clipboard
const mockClipboard = {
  writeText: vi.fn(),
};
Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  value: mockClipboard,
});

describe('ShareButtons', () => {
  const mockProps = {
    shareText: 'あなたは挑戦者タイプ\n果敢に挑戦し、新しい道を切り拓く冒険家\n#性格診断 https://example.com/result',
    shareUrl: 'https://example.com/tests/bigfive/result?id=test123',
    resultId: 'test123',
  };

  beforeEach(() => {
    mockWindowOpen.mockClear();
    mockClipboard.writeText.mockClear();
    mockClipboard.writeText.mockResolvedValue(undefined);
  });

  describe('Twitter/X Share Button', () => {
    it('should render Twitter/X button', () => {
      render(<ShareButtons {...mockProps} />);
      const button = screen.getByRole('button', { name: /Xでシェア|X \(Twitter\) でシェア/i });
      expect(button).toBeTruthy();
    });

    it('should call window.open with correct Twitter URL when clicked', () => {
      render(<ShareButtons {...mockProps} />);
      const button = screen.getByRole('button', { name: /Xでシェア|X \(Twitter\) でシェア/i });

      fireEvent.click(button);

      expect(mockWindowOpen).toHaveBeenCalledTimes(1);
      const [url, target, features] = mockWindowOpen.mock.calls[0];
      expect(url).toContain('https://twitter.com/intent/tweet');
      expect(url).toContain('text=');
      expect(url).toContain(encodeURIComponent(mockProps.shareText));
    });

    it('should properly encode share text for Twitter', () => {
      const specialProps = {
        ...mockProps,
        shareText: 'テスト&共有<>文字"',
      };
      render(<ShareButtons {...specialProps} />);
      const button = screen.getByRole('button', { name: /Xでシェア|X \(Twitter\) でシェア/i });

      fireEvent.click(button);

      const [url] = mockWindowOpen.mock.calls[0];
      expect(url).toContain(encodeURIComponent('テスト&共有<>文字"'));
    });
  });

  describe('LINE Share Button', () => {
    it('should render LINE button', () => {
      render(<ShareButtons {...mockProps} />);
      const button = screen.getByRole('button', { name: /LINEでシェア/i });
      expect(button).toBeTruthy();
    });

    it('should call window.open with correct LINE URL when clicked', () => {
      render(<ShareButtons {...mockProps} />);
      const button = screen.getByRole('button', { name: /LINEでシェア/i });

      fireEvent.click(button);

      expect(mockWindowOpen).toHaveBeenCalledTimes(1);
      const [url] = mockWindowOpen.mock.calls[0];
      expect(url).toContain('https://social-plugins.line.me/lineit/share');
      expect(url).toContain('url=');
      expect(url).toContain(encodeURIComponent(mockProps.shareUrl));
    });

    it('should properly encode share URL for LINE', () => {
      const specialProps = {
        ...mockProps,
        shareUrl: 'https://example.com/test?id=123&special=<>&"',
      };
      render(<ShareButtons {...specialProps} />);
      const button = screen.getByRole('button', { name: /LINEでシェア/i });

      fireEvent.click(button);

      const [url] = mockWindowOpen.mock.calls[0];
      expect(url).toContain(encodeURIComponent('https://example.com/test?id=123&special=<>&"'));
    });
  });

  describe('Clipboard Copy Button', () => {
    it('should render copy button', () => {
      render(<ShareButtons {...mockProps} />);
      const button = screen.getByRole('button', { name: /リンクをコピー|URLをコピー/i });
      expect(button).toBeTruthy();
    });

    it('should call navigator.clipboard.writeText when clicked', async () => {
      render(<ShareButtons {...mockProps} />);
      const button = screen.getByRole('button', { name: /リンクをコピー|URLをコピー/i });

      fireEvent.click(button);

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledTimes(1);
        expect(mockClipboard.writeText).toHaveBeenCalledWith(mockProps.shareUrl);
      });
    });

    it('should show success toast after copy', async () => {
      render(<ShareButtons {...mockProps} />);
      const button = screen.getByRole('button', { name: /リンクをコピー|URLをコピー/i });

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/コピーしました|URLをコピーしました/i)).toBeTruthy();
      });
    });

    // Note: Toast auto-hide behavior (after 3 seconds) is tested in E2E tests
    // Unit testing setTimeout with fake timers is complex and not critical here
  });

  describe('Props Validation', () => {
    it('should render all three buttons', () => {
      render(<ShareButtons {...mockProps} />);

      expect(screen.getByRole('button', { name: /Xでシェア|X \(Twitter\) でシェア/i })).toBeTruthy();
      expect(screen.getByRole('button', { name: /LINEでシェア/i })).toBeTruthy();
      expect(screen.getByRole('button', { name: /リンクをコピー|URLをコピー/i })).toBeTruthy();
    });
  });
});
