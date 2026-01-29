"""
RAG Engine for DropSkill AI
Uses ChromaDB for vector storage and retrieval of ecommerce knowledge base
"""
import os
from typing import List, Dict, Optional
from pathlib import Path

# Note: In production, use actual embeddings. For MVP, using simple text matching.
class RAGEngine:
    def __init__(self, persist_directory: str = "./chroma_db"):
        self.persist_directory = persist_directory
        self.knowledge_base = self._load_knowledge_base()
        
    def _load_knowledge_base(self) -> Dict[str, str]:
        """Load knowledge base documents"""
        kb_path = Path(__file__).parent / "knowledge_base"
        documents = {}
        
        if kb_path.exists():
            for file in kb_path.glob("*.md"):
                with open(file, "r", encoding="utf-8") as f:
                    documents[file.stem] = f.read()
        
        # Default knowledge if no files exist
        if not documents:
            documents = {
                "pricing_strategies": self._get_default_pricing_knowledge(),
                "ecommerce_best_practices": self._get_default_ecommerce_knowledge(),
                "product_selection": self._get_default_product_knowledge(),
                "marketing_tips": self._get_default_marketing_knowledge()
            }
        
        return documents
    
    def _get_default_pricing_knowledge(self) -> str:
        return """
# Pricing Strategies for Ecommerce

## Competitive Pricing
- Research competitor prices for similar products
- Price 5-15% below market leaders for new stores
- Consider perceived value, not just cost

## Psychological Pricing
- Use .99 endings for budget items
- Use round numbers for premium products
- Bundle products for perceived savings

## Margin Guidelines
- Tech accessories: 30-50% margin typical
- Electronics: 15-25% margin
- Cables/adapters: 50-70% margin
- Phone cases: 40-60% margin

## Dynamic Pricing
- Lower prices on slow-moving inventory
- Increase prices during high demand
- Offer discounts for first-time buyers
"""

    def _get_default_ecommerce_knowledge(self) -> str:
        return """
# Ecommerce Best Practices

## Store Setup
- Choose a memorable store name
- Write clear product descriptions
- Use high-quality product images
- Enable multiple payment options

## Customer Experience
- Fast page loading essential
- Mobile-friendly design
- Easy checkout process
- Clear return policy

## Trust Building
- Display customer reviews
- Show secure payment badges
- Provide contact information
- Offer money-back guarantees

## Inventory Management
- Track stock levels daily
- Set low-stock alerts
- Avoid overselling
- Plan for seasonal demand
"""

    def _get_default_product_knowledge(self) -> str:
        return """
# Product Selection Guide

## High-Demand Categories (Tech & Accessories)
1. Phone accessories (cases, chargers, screen protectors)
2. Laptop accessories (stands, cooling pads, bags)
3. Audio (earbuds, headphones, speakers)
4. Smart home devices
5. Cables and adapters

## Product Selection Criteria
- High demand score (>0.7)
- Good profit margin (>30%)
- Low return rate
- Positive supplier reviews
- Consistent availability

## Products to Avoid
- Highly seasonal items (unless planned)
- Products with patent issues
- Items with high shipping costs
- Frequently returned items
"""

    def _get_default_marketing_knowledge(self) -> str:
        return """
# Marketing Strategies

## Social Media
- Instagram for visual products
- TikTok for trending items
- Facebook for broad reach
- Pinterest for lifestyle products

## Content Marketing
- Product tutorials
- Comparison guides
- Use case stories
- Customer testimonials

## Promotions
- Limited-time offers create urgency
- Bundle deals increase order value
- Free shipping thresholds
- Loyalty rewards

## Email Marketing
- Welcome series for new subscribers
- Abandoned cart reminders
- New product announcements
- Seasonal promotions
"""
    
    def search(self, query: str, top_k: int = 3) -> List[Dict]:
        """Search knowledge base for relevant content"""
        results = []
        query_lower = query.lower()
        
        # Simple keyword matching for MVP
        # In production, use proper embeddings and vector search
        keyword_mappings = {
            "pricing_strategies": ["price", "pricing", "margin", "cost", "discount", "expensive", "cheap"],
            "ecommerce_best_practices": ["store", "shop", "customer", "checkout", "trust", "experience"],
            "product_selection": ["product", "sell", "demand", "category", "inventory", "stock"],
            "marketing_tips": ["marketing", "advertise", "social", "promote", "traffic", "sales"]
        }
        
        scores = {}
        for doc_name, keywords in keyword_mappings.items():
            score = sum(1 for kw in keywords if kw in query_lower)
            if score > 0:
                scores[doc_name] = score
        
        # Sort by score and return top_k
        sorted_docs = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:top_k]
        
        for doc_name, score in sorted_docs:
            results.append({
                "document": doc_name,
                "content": self.knowledge_base.get(doc_name, ""),
                "relevance_score": score / 5  # Normalize
            })
        
        return results
    
    def get_context_for_query(self, query: str) -> str:
        """Get relevant context for a query"""
        results = self.search(query)
        if not results:
            return ""
        
        context_parts = []
        for result in results:
            context_parts.append(f"## {result['document'].replace('_', ' ').title()}\n{result['content']}")
        
        return "\n\n".join(context_parts)
