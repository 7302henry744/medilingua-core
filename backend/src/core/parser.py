from lxml import etree
from .schemas import Segment
from typing import List
import io

class XliffParser:
    def parse(self, file_content: bytes) -> List[Segment]:
        """
        Parses XLIFF 1.2 content and extracts translation units.
        """
        segments = []
        try:
            # Parse XML safely
            parser = etree.XMLParser(recover=True)
            tree = etree.parse(io.BytesIO(file_content), parser)
            root = tree.getroot()
            
            # XLIFF 1.2 namespace handling
            ns = {'x': 'urn:oasis:names:tc:xliff:document:1.2'}
            
            # Find all trans-unit elements
            # XPath looks for any trans-unit in the defined namespace
            units = root.xpath('//x:trans-unit', namespaces=ns)
            
            if not units:
                # Fallback: try without namespace if the file is malformed/simple
                units = root.xpath('//trans-unit')

            for unit in units:
                segment_id = unit.get('id', 'unknown')
                
                # Extract source
                source_node = unit.find('x:source', namespaces=ns)
                if source_node is None:
                    source_node = unit.find('source')
                    
                source_text = source_node.text if source_node is not None else ""
                
                # Extract target (if exists)
                target_node = unit.find('x:target', namespaces=ns)
                if target_node is None:
                    target_node = unit.find('target')
                
                target_text = target_node.text if target_node is not None else None

                segments.append(Segment(
                    id=segment_id,
                    source_text=source_text or "",
                    target_text=target_text
                ))
                
        except Exception as e:
            print(f"Parsing Error: {e}")
            raise ValueError("Invalid XLIFF file format")

        return segments