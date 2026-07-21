import os
from datetime import datetime
from typing import Dict, Any, List
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from app.config import settings

class PDFReportGenerator:
    """PDF Scorecard Generator built with ReportLab."""

    @staticmethod
    def generate_interview_report(
        interview_id: str,
        user_name: str,
        topic: str,
        difficulty: str,
        scorecard: Dict[str, Any],
        transcript_turns: List[Dict[str, Any]]
    ) -> str:
        """Generate PDF scorecard report and return file path."""
        file_name = f"interview_report_{interview_id}.pdf"
        file_path = os.path.join(settings.REPORTS_DIR, file_name)

        doc = SimpleDocTemplate(
            file_path,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        
        # Custom Styles
        title_style = ParagraphStyle(
            'ReportTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=24,
            leading=28,
            textColor=colors.HexColor('#4F46E5')
        )
        
        subtitle_style = ParagraphStyle(
            'ReportSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=11,
            leading=14,
            textColor=colors.HexColor('#6B7280')
        )

        h2_style = ParagraphStyle(
            'Heading2Custom',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=14,
            leading=18,
            textColor=colors.HexColor('#1F2937'),
            spaceBefore=12,
            spaceAfter=6
        )

        body_style = ParagraphStyle(
            'BodyCustom',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#374151')
        )

        story = []

        # 1. Header & Title
        story.append(Paragraph("AI Interviewer Pro — Candidate Scorecard", title_style))
        story.append(Paragraph(f"Generated on {datetime.utcnow().strftime('%B %d, %Y at %H:%M UTC')} | Confidential Evaluation Report", subtitle_style))
        story.append(Spacer(1, 12))
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#4F46E5'), spaceAfter=15))

        # 2. Candidate Metadata Box
        meta_data = [
            [Paragraph("<b>Candidate Name:</b>", body_style), Paragraph(user_name, body_style), Paragraph("<b>Topic:</b>", body_style), Paragraph(topic.upper(), body_style)],
            [Paragraph("<b>Interview ID:</b>", body_style), Paragraph(interview_id[:12], body_style), Paragraph("<b>Difficulty:</b>", body_style), Paragraph(difficulty.capitalize(), body_style)],
            [Paragraph("<b>Overall Score:</b>", body_style), Paragraph(f"<b><font color='#4F46E5'>{scorecard.get('total_score', 0.0)} / 100</font></b>", body_style), Paragraph("<b>Status:</b>", body_style), Paragraph("COMPLETED", body_style)]
        ]
        
        meta_table = Table(meta_data, colWidths=[110, 160, 90, 160])
        meta_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F3F4F6')),
            ('PADDING', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E5E7EB')),
        ]))
        story.append(meta_table)
        story.append(Spacer(1, 15))

        # 3. Score Breakdown Table
        story.append(Paragraph("Performance Scorecard Breakdown", h2_style))
        breakdown = scorecard.get("breakdown", {})
        
        score_data = [
            ["Evaluation Category", "Weight", "Score (100)", "Weighted Output"],
            ["Technical Accuracy", "40%", f"{breakdown.get('technical_accuracy', 0.0)}", f"{round(breakdown.get('technical_accuracy', 0.0) * 0.4, 1)}"],
            ["Problem Solving", "20%", f"{breakdown.get('problem_solving', 0.0)}", f"{round(breakdown.get('problem_solving', 0.0) * 0.2, 1)}"],
            ["Communication & WPM", "20%", f"{breakdown.get('communication', 0.0)}", f"{round(breakdown.get('communication', 0.0) * 0.2, 1)}"],
            ["Confidence & Eye Contact", "10%", f"{breakdown.get('confidence', 0.0)}", f"{round(breakdown.get('confidence', 0.0) * 0.1, 1)}"],
            ["Professionalism & Posture", "10%", f"{breakdown.get('professionalism', 0.0)}", f"{round(breakdown.get('professionalism', 0.0) * 0.1, 1)}"],
            ["Total Score", "100%", "-", f"{scorecard.get('total_score', 0.0)} / 100"]
        ]

        score_table = Table(score_data, colWidths=[180, 80, 130, 130])
        score_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#4F46E5')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('ALIGN', (1,0), (-1,-1), 'CENTER'),
            ('PADDING', (0,0), (-1,-1), 6),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#D1D5DB')),
            ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor('#EEF2FF')),
            ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
        ]))
        story.append(score_table)
        story.append(Spacer(1, 15))

        # 4. Feedback & Recommendation
        story.append(Paragraph("Qualitative Feedback & Key Takeaways", h2_style))
        feedback_list = scorecard.get("feedback_summary", ["Solid effort presented across technical topics."])
        for fb in feedback_list:
            story.append(Paragraph(f"• {fb}", body_style))
            story.append(Spacer(1, 4))
        
        story.append(Spacer(1, 15))

        # 5. Question & Answer Summary
        if transcript_turns:
            story.append(Paragraph("Question & Answer Log", h2_style))
            for idx, turn in enumerate(transcript_turns, start=1):
                q_txt = turn.get("question", f"Question {idx}")
                ans_txt = turn.get("user_transcript", "No answer recorded.")
                eval_txt = turn.get("ai_evaluation", "Evaluated successfully.")
                
                story.append(Paragraph(f"<b>Q{idx}: {q_txt}</b>", ParagraphStyle('QStyle', parent=body_style, fontName='Helvetica-Bold', textColor=colors.HexColor('#1E1B4B'))))
                story.append(Spacer(1, 2))
                story.append(Paragraph(f"<b>Answer:</b> <i>\"{ans_txt}\"</i>", ParagraphStyle('AStyle', parent=body_style, textColor=colors.HexColor('#374151'))))
                story.append(Spacer(1, 2))
                story.append(Paragraph(f"<b>AI Evaluation ({turn.get('score', 80.0)}/100):</b> {eval_txt}", ParagraphStyle('EStyle', parent=body_style, textColor=colors.HexColor('#047857'))))
                story.append(Spacer(1, 8))

        doc.build(story)
        return file_path

pdf_service = PDFReportGenerator()
