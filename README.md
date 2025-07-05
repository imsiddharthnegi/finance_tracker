# Personal Finance Tracker

A comprehensive web application for tracking personal finances, built with Next.js, React, shadcn/ui, and Recharts. This application implements all three stages of financial management: transaction tracking, categorization, and budgeting with insights.

![Personal Finance Tracker](https://img.shields.io/badge/Stage-3%20Complete-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-cyan)

## 🌟 Features

### Stage 1: Basic Transaction Tracking ✅
- **Add/Edit/Delete Transactions**: Complete CRUD operations for financial transactions
- **Transaction List View**: Comprehensive list with filtering and sorting capabilities
- **Monthly Expenses Chart**: Visual representation of spending patterns over time
- **Form Validation**: Robust client-side validation for data integrity
- **Real-time Updates**: Instant UI updates after transaction modifications

### Stage 2: Categories & Dashboard ✅
- **Predefined Categories**: 14 expense categories with intuitive icons
- **Category-wise Pie Chart**: Visual breakdown of spending by category
- **Dashboard Summary Cards**: 
  - Total Income/Expenses
  - Current Balance
  - Transaction Count
  - Top Expense Categories
- **Recent Transactions**: Quick overview of latest financial activities

### Stage 3: Budgeting & Insights ✅
- **Monthly Category Budgets**: Set spending limits for each category
- **Budget vs Actual Comparison**: Visual charts comparing planned vs actual spending
- **Spending Insights**: 
  - High category concentration alerts
  - Weekend spending patterns
  - Budget adherence tracking
- **Budget Management**: Easy budget creation, editing, and deletion

## 🎨 Design Features

- **Modern UI/UX**: Professional design with gradient backgrounds and glass morphism effects
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Subtle transitions and hover effects for enhanced user experience
- **Dark Mode Support**: Built-in dark/light theme switching
- **Accessibility**: WCAG compliant with proper focus states and keyboard navigation

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React icons
- **Storage**: File-based JSON storage (easily replaceable with MongoDB)
- **Deployment**: Vercel-ready configuration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finance-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update the environment variables as needed:
   ``
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage Guide

### Adding Transactions
1. Click the "Add Transaction" button
2. Fill in the amount, select category, and add description
3. Choose transaction type (income/expense)
4. Submit to save

### Setting Budgets
1. Navigate to the "Budgets" tab
2. Click "Set Budget" 
3. Select month, category, and budget amount
4. Monitor progress in the comparison charts

### Viewing Insights
1. Go to the "Insights" tab
2. Review spending patterns and recommendations
3. Check category concentration and timing patterns
4. Use insights to improve financial habits

## 🏗️ Project Structure

```
finance-tracker/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── transactions/  # Transaction CRUD operations
│   │   │   └── budgets/       # Budget management
│   │   ├── globals.css        # Global styles and animations
│   │   ├── layout.tsx         # Root layout component
│   │   └── page.tsx           # Main dashboard page
│   ├── components/            # React components
│   │   ├── charts/           # Chart components (Recharts)
│   │   ├── dashboard/        # Dashboard-specific components
│   │   ├── forms/            # Form components
│   │   └── ui/               # shadcn/ui components
│   ├── lib/                  # Utility functions
│   │   ├── categories.ts     # Category definitions
│   │   ├── mongodb.ts        # Database connection
│   │   └── storage.ts        # File-based storage
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## 🔧 API Endpoints

### Transactions
- `GET /api/transactions` - Fetch all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Budgets
- `GET /api/budgets` - Fetch all budgets
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/[id]` - Update budget
- `DELETE /api/budgets/[id]` - Delete budget
- `GET /api/budgets/comparison` - Get budget vs actual comparison

## 🎯 Key Features Implementation

### Transaction Management
- Real-time CRUD operations with optimistic updates
- Form validation with error handling
- Category-based organization with visual icons
- Date-based filtering and sorting

### Budget Tracking
- Monthly budget allocation by category
- Visual progress tracking with charts
- Overspending alerts and notifications
- Historical budget performance analysis

### Data Visualization
- Interactive charts using Recharts library
- Responsive design for all screen sizes
- Color-coded categories for easy identification
- Animated transitions for smooth user experience

### User Experience
- Intuitive navigation with tab-based interface
- Quick action cards for common operations
- Contextual help and guidance
- Error states and loading indicators


### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 📊 Performance Optimizations

- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js Image component for optimized loading
- **Lazy Loading**: Components loaded on demand
- **Caching**: Efficient caching strategies for API responses
- **Bundle Analysis**: Optimized bundle size for faster loading

## 🔒 Security Features

- **Input Validation**: Comprehensive validation on both client and server
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Built-in Next.js security features
- **Environment Variables**: Secure configuration management

## 🧪 Testing

The application has been thoroughly tested for:
- ✅ Transaction CRUD operations
- ✅ Budget management functionality
- ✅ Chart rendering and data visualization
- ✅ Responsive design across devices
- ✅ Form validation and error handling
- ✅ Navigation and user flows

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Recharts** for powerful data visualization
- **Lucide** for the comprehensive icon set
- **Tailwind CSS** for utility-first styling
- **Next.js** for the robust React framework

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using Next.js, React, and modern web technologies**

*Stage 3: Budgeting & Insights Implementation Complete* ✨

