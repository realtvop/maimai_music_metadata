import os
import json
import xml.etree.ElementTree as ET
from pathlib import Path

def main():
    script_dir = Path(__file__).parent
    map_bonus_music_dir = script_dir / "mapBonusMusic"
    
    song_id_map = {}
    
    for subdir in map_bonus_music_dir.iterdir():
        if not subdir.is_dir():
            continue
        
        for xml_file in subdir.glob("*.xml"):
            try:
                tree = ET.parse(xml_file)
                root = tree.getroot()
                
                for string_id in root.findall(".//MusicIds/list/StringID"):
                    id_elem = string_id.find("id")
                    str_elem = string_id.find("str")
                    
                    if id_elem is not None and str_elem is not None:
                        music_id = id_elem.text
                        music_str = str_elem.text
                        
                        if music_id and music_str:
                            song_id_map[int(music_id)] = music_str
                            
            except ET.ParseError as e:
                print(f"Err when processing {xml_file}: {e}")
            except Exception as e:
                print(f"Err when processing {xml_file}: {e}")
    
    sorted_song_id_map = dict(sorted(song_id_map.items(), key=lambda x: x[0]))
    
    output_file = script_dir / "songid.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(sorted_song_id_map, f, ensure_ascii=False, indent=2)
    
if __name__ == "__main__":
    main()
