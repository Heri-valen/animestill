# Admin Panel & Home Redesign Design

**Goal:** Create a WordPress-like admin panel and modern anime-themed home page for OtakuTees.store

---

## 1. Admin Panel Design

### Navigation Structure

```
/admin
├── Dashboard
│   - Revenue stats
│   - Pending orders
│   - Recent activity
├── Products
│   - List (CRUD)
│   - Create/Edit form
│   - Inventory management
├── Orders
│   - List with filters
│   - Order details
├── Customers
│   - User list
│   - Purchase history
├── Stamps
│   - Image gallery
│   - Categories
├── Settings
│   - Payment (PayU config)
│   - General (store name, logo)
│   - Shipping
```

### UI/UX

- **Sidebar:** Fixed left, collapsible, dark theme
- **Content Area:** White/light cards on dark background
- **Tables:** Search, sort, pagination, bulk actions
- **Forms:** Inline validation, file uploads
- **Modals:** Quick actions (edit status, view details)

### PayU Configuration

- API Key input (masked)
- Merchant ID
- Test/Production mode toggle
- Webhook URL display

---

## 2. Home Page Redesign

### Sections

| Section | Content |
|---------|---------|
| Hero | Auto-slider with promotions + CTA buttons |
| Categories | 3 visual cards: Camisetas, Sudaderas, Accesorios |
| Featured Products | Grid with hover effects, "Personalizar" button |
| Popular Stamps | Image gallery |
| How It Works | 3-step process |
| Footer | Links, social media, policies |

### Visual Style

- **Theme:** Dark otaku with vibrant accents
- **Colors:** 
  - Primary: Dark (#1a1a2e)
  - Accent: Pink (#ff6b6b), Cyan (#4ecdc4)
- **Animations:** Smooth transitions, hover effects
- **Typography:** Modern sans-serif

---

## Implementation Priority

1. Admin Dashboard + Products + Orders + Payment Config
2. Customers + Stamps + Settings
3. Home redesign
