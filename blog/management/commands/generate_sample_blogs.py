from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from blog.models import BlogPost, Category, Tag
from django.utils.text import slugify
import random
from datetime import timedelta
from django.utils import timezone

class Command(BaseCommand):
    help = 'Generates sample blog posts with SEO-friendly content'

    def add_arguments(self, parser):
        parser.add_argument('--count', type=int, default=5, help='Number of blog posts to generate')

    def handle(self, *args, **options):
        count = options['count']
        
        # Ensure we have at least one author
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@example.com',
                'is_staff': True,
                'is_superuser': True
            }
        )
        
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS(f'Created admin user: {admin_user.username}'))
        
        # Create some categories if they don't exist
        categories = []
        for name in ['AI Technology', 'Machine Learning', 'Productivity', 'Tutorials', 'Case Studies']:
            category, created = Category.objects.get_or_create(name=name)
            categories.append(category)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created category: {category.name}'))
        
        # Create some tags if they don't exist
        tags = []
        for name in ['Artificial Intelligence', 'Neural Networks', 'Deep Learning', 'NLP', 'Computer Vision', 
                    'Data Science', 'Python', 'TensorFlow', 'PyTorch', 'Workflow Automation']:
            tag, created = Tag.objects.get_or_create(name=name)
            tags.append(tag)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created tag: {tag.name}'))
        
        # Sample blog post content
        blog_posts_data = [
            {
                'title': 'The Future of AI in Business Automation',
                'excerpt': 'Discover how AI is transforming business operations and creating new opportunities for automation and efficiency.',
                'content': '''
<h2>The Future of AI in Business Automation</h2>

<p>Artificial Intelligence is revolutionizing how businesses operate by automating complex tasks that once required human intervention. This article explores the current state of AI in business and what the future holds.</p>

<h3>Current AI Applications in Business</h3>

<p>Today's businesses are implementing AI in various ways:</p>

<ul>
    <li><a href="/blog/natural-language-processing">Natural Language Processing</a> for customer service</li>
    <li>Predictive analytics for inventory management</li>
    <li>Machine learning for <a href="https://www.mckinsey.com/capabilities/quantumblack/our-insights/global-survey-the-state-of-ai-in-2022" target="_blank">process optimization</a></li>
</ul>

<h3>The ROI of AI Implementation</h3>

<p>According to recent studies, businesses that implement AI solutions see an average ROI increase of 25% within the first year. This is particularly evident in:</p>

<ol>
    <li>Reduced operational costs</li>
    <li>Improved decision-making speed</li>
    <li>Enhanced customer experiences</li>
</ol>

<p>In fact, <a href="/case-studies/enterprise-ai">our recent case study</a> demonstrated how a mid-sized manufacturing company reduced waste by 30% using AI-powered predictive maintenance.</p>

<h3>Looking Ahead: AI in 2025 and Beyond</h3>

<p>The future of AI in business looks promising, with several emerging trends:</p>

<blockquote>
    <p>"AI will become as standard in business operations as email and spreadsheets are today." - Dr. Andrew Ng</p>
</blockquote>

<p>Key developments to watch include:</p>

<ul>
    <li>Integration of AI with IoT systems</li>
    <li>More accessible AI development platforms</li>
    <li>Specialized AI for industry-specific applications</li>
</ul>

<p>Learn more about how <a href="https://kavoshai.com/features">Kavosh AI can help your business</a> implement these cutting-edge solutions today.</p>
''',
                'meta_title': 'The Future of AI in Business Automation | 2023 Trends',
                'meta_description': 'Explore how artificial intelligence is revolutionizing business automation in 2023 and beyond. Discover the latest AI technologies transforming workflows.',
                'focus_keywords': 'AI business automation, future of AI, business AI applications',
                'is_featured': True,
            },
            {
                'title': 'How to Implement NLP in Customer Service Systems',
                'excerpt': 'A step-by-step guide to implementing Natural Language Processing in your customer service workflows for better efficiency and customer satisfaction.',
                'content': '''
<h2>Implementing NLP in Customer Service: A Complete Guide</h2>

<p>Natural Language Processing (NLP) is transforming customer service by enabling computers to understand and respond to human language naturally. This guide will walk you through implementing NLP in your customer service systems.</p>

<h3>What is NLP and Why Does It Matter?</h3>

<p>NLP combines computational linguistics, machine learning, and deep learning to process human language. In customer service, it powers:</p>

<ul>
    <li>Chatbots and virtual assistants</li>
    <li>Sentiment analysis of customer feedback</li>
    <li>Automated ticket routing and prioritization</li>
</ul>

<p>According to <a href="https://www.gartner.com/en/newsroom/press-releases/2021-02-15-gartner-predicts-conversational-ai-will-reduce-contact-center-agent-labor-costs-by-30-percent-by-2023" target="_blank">Gartner research</a>, conversational AI will reduce contact center agent labor costs by 30% by 2023.</p>

<h3>Getting Started with NLP Implementation</h3>

<p>Follow these steps to implement NLP in your customer service:</p>

<ol>
    <li>Identify specific use cases and goals</li>
    <li>Collect and prepare your data</li>
    <li>Choose the right NLP tools and platforms</li>
    <li>Build and train your models</li>
    <li>Integrate with existing systems</li>
    <li>Monitor performance and refine</li>
</ol>

<p>For more details on data preparation, read our <a href="/blog/preparing-data-for-nlp">guide to preparing data for NLP projects</a>.</p>

<h3>Case Study: How Company X Improved Customer Satisfaction</h3>

<p>Company X implemented NLP-powered chatbots and saw:</p>

<ul>
    <li>42% reduction in response time</li>
    <li>35% increase in customer satisfaction scores</li>
    <li>28% reduction in support costs</li>
</ul>

<p>The key was training their models on historical customer interactions and continuously improving them based on feedback.</p>

<p>Learn more about <a href="https://kavoshai.com/features/nlp">our NLP solutions</a> and how they can transform your customer service experience.</p>
''',
                'meta_title': 'Implementing NLP in Customer Service: Complete Guide 2023',
                'meta_description': 'Learn how to implement Natural Language Processing in customer service systems with this comprehensive guide. Improve response times and customer satisfaction.',
                'focus_keywords': 'NLP customer service, natural language processing implementation, customer service automation',
            },
            {
                'title': '5 Machine Learning Models Every Data Scientist Should Know',
                'excerpt': 'An overview of the most important machine learning models that every data scientist should understand and know how to implement.',
                'content': '''
<h2>5 Essential Machine Learning Models for Data Scientists</h2>

<p>Whether you're just starting your data science journey or looking to refresh your knowledge, understanding these five machine learning models is essential for your toolkit.</p>

<h3>1. Linear Regression</h3>

<p>The foundation of predictive modeling, linear regression establishes relationships between dependent and independent variables.</p>

<pre><code>import sklearn
from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)
</code></pre>

<p>For a deeper dive into implementation, check our <a href="/blog/linear-regression-techniques">advanced linear regression techniques</a> article.</p>

<h3>2. Decision Trees</h3>

<p>Decision trees create a model that predicts the value of a target variable by learning simple decision rules from the data.</p>

<p>Key advantages include:</p>

<ul>
    <li>Easy to understand and interpret</li>
    <li>Requires little data preprocessing</li>
    <li>Can handle both numerical and categorical data</li>
</ul>

<p>Learn more about <a href="https://scikit-learn.org/stable/modules/tree.html" target="_blank">decision trees in scikit-learn</a>.</p>

<h3>3. Support Vector Machines</h3>

<p>SVMs are powerful for both classification and regression, particularly effective in high-dimensional spaces.</p>

<blockquote>
    <p>"SVMs deliver state-of-the-art performance in real-world applications such as text classification and computer vision." - Dr. Jane Smith, ML Researcher</p>
</blockquote>

<h3>4. Random Forests</h3>

<p>Random forests improve on decision trees by creating multiple trees and combining their outputs:</p>

<ul>
    <li>Reduced overfitting</li>
    <li>Greater accuracy</li>
    <li>Built-in feature importance</li>
</ul>

<p>See our <a href="/case-studies/random-forest-applications">case study on random forest applications</a> in the financial sector.</p>

<h3>5. Neural Networks</h3>

<p>The backbone of deep learning, neural networks excel at:</p>

<ul>
    <li>Image and speech recognition</li>
    <li>Natural language processing</li>
    <li>Complex pattern recognition</li>
</ul>

<p>Explore our <a href="https://kavoshai.com/features/deep-learning">deep learning solutions</a> to see how neural networks can solve your business problems.</p>
''',
                'meta_title': '5 Essential Machine Learning Models for Data Scientists',
                'meta_description': 'Discover the 5 most important machine learning models every data scientist should master, with practical implementation examples and use cases.',
                'focus_keywords': 'machine learning models, data science, linear regression, neural networks, decision trees',
            },
            {
                'title': 'Building a Robust ETL Pipeline for AI Projects',
                'excerpt': 'Learn how to design and implement a reliable ETL (Extract, Transform, Load) pipeline for your AI and machine learning projects.',
                'content': '''
<h2>Building ETL Pipelines for AI Projects</h2>

<p>A robust Extract, Transform, Load (ETL) pipeline is the foundation of any successful AI project. This guide will help you build efficient data pipelines that ensure your AI models have clean, reliable data.</p>

<h3>The Importance of ETL in AI</h3>

<p>According to the <a href="https://www.ibm.com/analytics/data-preparation" target="_blank">IBM Data Science Survey</a>, data scientists spend 70-80% of their time on data preparation. A well-designed ETL pipeline can significantly reduce this time.</p>

<p>Key benefits include:</p>

<ul>
    <li>Improved data quality and consistency</li>
    <li>Faster model development and deployment</li>
    <li>Easier data governance and compliance</li>
    <li>Scalable data processing</li>
</ul>

<h3>Core Components of an AI-Ready ETL Pipeline</h3>

<h4>1. Data Extraction</h4>

<p>Sources typically include:</p>

<ul>
    <li>Databases (SQL, NoSQL)</li>
    <li>APIs and web services</li>
    <li>File systems (CSV, JSON, etc.)</li>
    <li>Data warehouses</li>
</ul>

<p>For handling diverse data sources, check our <a href="/blog/connecting-data-sources">guide to connecting multiple data sources</a>.</p>

<h4>2. Data Transformation</h4>

<p>Critical transformations for AI include:</p>

<pre><code># Example data cleaning in Python
import pandas as pd
from sklearn.preprocessing import StandardScaler

# Handle missing values
df.fillna(df.mean(), inplace=True)

# Normalize numerical features
scaler = StandardScaler()
df[['feature1', 'feature2']] = scaler.fit_transform(df[['feature1', 'feature2']])
</code></pre>

<h4>3. Data Loading</h4>

<p>Consider these factors when designing your loading strategy:</p>

<ul>
    <li>Batch vs. streaming requirements</li>
    <li>Storage format optimization</li>
    <li>Query performance needs</li>
</ul>

<p>Learn more about <a href="https://kavoshai.com/features/data-pipeline">our data pipeline automation tools</a> that can simplify this process.</p>

<h3>ETL Best Practices for AI Projects</h3>

<ol>
    <li>Implement comprehensive data validation</li>
    <li>Design for incremental processing</li>
    <li>Build robust error handling and recovery</li>
    <li>Maintain detailed monitoring and logging</li>
    <li>Consider version control for data and schemas</li>
</ol>

<blockquote>
    <p>"The quality of your ETL pipeline directly affects the quality of your AI model. Invest time here first." - Data Engineering Team at Kavosh AI</p>
</blockquote>

<p>Explore our <a href="/case-studies/etl-implementation">case study on ETL implementation</a> for a leading healthcare provider.</p>
''',
                'meta_title': 'Building Robust ETL Pipelines for AI Projects | Best Practices',
                'meta_description': 'Learn how to design and implement effective ETL pipelines specifically for AI and machine learning projects. Best practices and real-world examples included.',
                'focus_keywords': 'ETL pipeline, AI data pipeline, data engineering, ETL for machine learning',
            },
            {
                'title': 'Explainable AI: Making ML Models Transparent',
                'excerpt': 'Understanding explainable AI (XAI) and its importance in creating transparent, interpretable machine learning models for critical applications.',
                'content': '''
<h2>Explainable AI: The Importance of Transparency in Machine Learning</h2>

<p>As AI systems become more integrated into critical decision-making processes, the need for explainable AI (XAI) has never been greater. This article explores why XAI matters and how to implement it in your machine learning projects.</p>

<h3>Why Explainability Matters</h3>

<p>AI explainability is crucial for several reasons:</p>

<ul>
    <li>Regulatory compliance (GDPR, CCPA, etc.)</li>
    <li>Building trust with users and stakeholders</li>
    <li>Identifying and addressing bias</li>
    <li>Debugging and improving models</li>
</ul>

<p>According to a <a href="https://www.pwc.com/us/en/tech-effect/ai-analytics/ai-predictions.html" target="_blank">PwC survey</a>, 84% of executives believe AI decisions must be explainable to be trusted.</p>

<h3>Techniques for Making AI Explainable</h3>

<h4>LIME (Local Interpretable Model-agnostic Explanations)</h4>

<p>LIME explains predictions by approximating the model locally with an interpretable model.</p>

<pre><code>import lime
import lime.lime_tabular

explainer = lime.lime_tabular.LimeTabularExplainer(
    training_data=X_train,
    feature_names=feature_names,
    class_names=class_names,
    mode='classification'
)

explanation = explainer.explain_instance(
    data_row=X_test[0], 
    predict_fn=model.predict_proba
)
</code></pre>

<p>For a more detailed LIME tutorial, visit our <a href="/blog/lime-tutorial">LIME explanation guide</a>.</p>

<h4>SHAP (SHapley Additive exPlanations)</h4>

<p>SHAP values provide consistent, locally accurate feature attributions based on game theory.</p>

<blockquote>
    <p>"SHAP values unite several previous methods and represent the only possible consistent and locally accurate additive feature attribution method." - Scott Lundberg, SHAP creator</p>
</blockquote>

<h4>Integrated Gradients</h4>

<p>Especially useful for deep learning models, integrated gradients attribute the prediction to input features.</p>

<p>Learn more in our <a href="/blog/integrated-gradients-explained">integrated gradients walkthrough</a>.</p>

<h3>Implementing XAI in Critical Industries</h3>

<h4>Healthcare Example</h4>

<p>In clinical decision support systems, explainability helps:</p>

<ul>
    <li>Physicians understand AI recommendations</li>
    <li>Patients trust AI-influenced decisions</li>
    <li>Regulators verify model safety</li>
</ul>

<p>See our <a href="https://kavoshai.com/case-studies/healthcare-ai">healthcare AI case study</a> for a real-world implementation.</p>

<h4>Financial Services</h4>

<p>For loan approval or fraud detection models, XAI provides:</p>

<ul>
    <li>Regulatory compliance documentation</li>
    <li>Fair lending evidence</li>
    <li>Customer transparency</li>
</ul>

<h3>Building XAI into Your AI Strategy</h3>

<ol>
    <li>Choose inherently interpretable models when possible</li>
    <li>Implement post-hoc explanation methods for complex models</li>
    <li>Design AI systems with explanation interfaces</li>
    <li>Train teams on communicating AI decisions</li>
</ol>

<p>Explore <a href="https://kavoshai.com/features/explainable-ai">our XAI solutions</a> to make your AI systems more transparent and trustworthy.</p>
''',
                'meta_title': 'Explainable AI: Making Machine Learning Models Transparent | XAI Guide',
                'meta_description': 'Learn why explainable AI matters and how to implement transparency in your machine learning models. Techniques, tools, and industry examples included.',
                'focus_keywords': 'explainable AI, XAI, AI transparency, interpretable machine learning, LIME, SHAP',
                'is_featured': True,
            },
        ]
        
        # Create the blog posts
        for i, post_data in enumerate(blog_posts_data[:count]):
            title = post_data['title']
            slug = slugify(title)
            
            # Check if post already exists
            if BlogPost.objects.filter(slug=slug).exists():
                slug = f"{slug}-{random.randint(1, 100)}"
                
            # Create the post
            post = BlogPost(
                title=title,
                slug=slug,
                author=admin_user,
                content=post_data['content'],
                content_format='html',  # We're using HTML content
                excerpt=post_data['excerpt'],
                meta_title=post_data.get('meta_title', title),
                meta_description=post_data.get('meta_description', post_data['excerpt']),
                focus_keywords=post_data.get('focus_keywords', ''),
                status='published',
                is_featured=post_data.get('is_featured', False),
                published_at=timezone.now() - timedelta(days=random.randint(1, 30))
            )
            post.save()
            
            # Add random categories (1-3)
            num_categories = random.randint(1, 3)
            post_categories = random.sample(list(categories), num_categories)
            post.categories.set(post_categories)
            
            # Add random tags (2-5)
            num_tags = random.randint(2, 5)
            post_tags = random.sample(list(tags), num_tags)
            post.tags.set(post_tags)
            
            self.stdout.write(self.style.SUCCESS(f'Created blog post: {post.title}'))
            
        self.stdout.write(self.style.SUCCESS(f'Successfully created {count} blog posts')) 