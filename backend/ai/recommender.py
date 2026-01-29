"""
AI Recommender for DropSkill AI
"""
from typing import List, Dict, Optional
from ai.rag_engine import RAGEngine

class AIRecommender:
    def __init__(self):
        self.rag = RAGEngine()
        
    def get_product_recommendations(self, query: str, store_data: Optional[Dict] = None, available_products: List[Dict] = []) -> Dict:
        """Generate product recommendations"""
        context = self.rag.get_context_for_query(query)
        existing_ids = set(store_data.get("product_ids", [])) if store_data else set()
        candidates = [p for p in available_products if p["id"] not in existing_ids]
        
        recommendations = []
        for product in candidates[:10]:
            score = product.get("demand_score", 0.5)
            if query.lower() in product.get("name", "").lower():
                score += 0.2
            recommendations.append({
                "product_id": product["id"],
                "name": product["name"],
                "category": product["category"],
                "price": product["price"],
                "score": min(score, 1.0),
                "reason": f"High demand in {product['category']}" if score >= 0.7 else "Good seller"
            })
        
        recommendations.sort(key=lambda x: x["score"], reverse=True)
        
        return {
            "recommendations": recommendations[:5],
            "insights": f"Found {len(recommendations)} products matching '{query}'",
            "suggested_actions": ["Import trending products", "Review pricing", "Share store link"]
        }
    
    def chat(self, message: str, conversation_history: List[Dict] = [], context: Dict = {}) -> Dict:
        """Process chat message"""
        msg = message.lower()
        user = context.get("user_name", "there")
        
        if any(w in msg for w in ["price", "pricing"]):
            text = f"Hi {user}! For pricing, aim for 30-50% margins on tech accessories. Use .99 endings for budget items."
        elif any(w in msg for w in ["product", "sell", "recommend"]):
            text = f"Hi {user}! Top sellers: phone cases, chargers, earbuds. Check products with demand score >0.7!"
        elif any(w in msg for w in ["marketing", "promote"]):
            text = f"Hi {user}! Share your store on social media, offer launch discounts, and ask for reviews!"
        else:
            text = f"Hi {user}! I can help with products, pricing, and marketing. What would you like to know?"
        
        return {"response": text, "suggested_products": None, "action_items": ["Import products", "Set prices", "Promote store"]}
    
    def generate_insights(self, store_name: str, store_products: List[Dict], all_products: List[Dict]) -> Dict:
        """Generate store insights"""
        store_ids = set(p["id"] for p in store_products)
        
        gaps = [{"product_id": p["id"], "name": p["name"], "reason": "High demand"} 
                for p in all_products[:10] if p["id"] not in store_ids and p.get("demand_score", 0) >= 0.7][:5]
        
        return {
            "summary": f"'{store_name}' has {len(store_products)} products",
            "product_gaps": gaps,
            "optimization_tips": ["Add more products", "Feature best sellers", "Update descriptions"],
            "risks": [] if len(store_products) >= 5 else ["Add more products for better conversion"]
        }
