from math import inf
from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class Graph:
    """
    This class implements the Graph structure in python
    """
    edges: List[tuple[str, str , int]]
    graph: Optional[dict] = field(default_factory=dict)

    def init_graph(self) -> None:
        """
        Created the graph dict struct with source and destination airports
        """
        for x, y, _ in self.edges:
            self.graph.setdefault(x, list()).append(y)

    def get_edges(self) -> List[tuple[str, str]]:
        """
        Returns all airports edges connections on graph structure
        """
        return self.edges

    def get_nodes(self) -> List[str]:
        """
        Returns all airports names
        """
        return list(self.graph.keys())

    def get_graph(self) -> dict:
        """
        Returns the graph dict
        """
        return self.graph

    def get_adjacentes_list(self):
        adjacents = {n: {} for n in self.get_nodes()}
        for first, second, distance in self.edges:
            adjacents.setdefault(first, dict())[second] = distance
            adjacents.setdefault(second, dict())[first] = distance
        return adjacents

    def get_distances_list(self, start: str):
        distances = dict()
        for first, second, _ in self.edges:
            distances[first] = (inf, None)
            distances[second] = (inf, None)
        distances[start] = (0, start)
        return distances

    def dijkstra(self, start: str):
        nodes = self.get_nodes()
        distances = self.get_distances_list(start=start)
        adjacents = self.get_adjacentes_list()

        temporary_nodes = [n for n in nodes]
        while len(temporary_nodes) > 0:
            upper_bounds = {n: distances[n] for n in temporary_nodes}
            lower_bound = min(upper_bounds, key=lambda v: upper_bounds.get(v)[0])
            temporary_nodes.remove(lower_bound)

            for node, distance in adjacents[lower_bound].items():
                new_distance = (distances[lower_bound][0] + distance, lower_bound)
                distances[node] = min(distances[node], new_distance, key=lambda v:v[0])
        return distances

    def find_shortest_path(self, start: str, end: str):
        path = list()
        path.append(end)
        dijkstra_dict = self.dijkstra(start=start)

        _, node = dijkstra_dict.get(end)
        while node != start:
            path.append(node)
            _, node = dijkstra_dict.get(node)
        path.append(start)
        path.reverse()
        return path

    def knapSack(
        self,
        max_weight,
        weights,
        values,
        values_len
    ):
        knap = [
            [0 for x in range(max_weight + 1)] 
            for x in range(values_len + 1)
        ] 
        for i in range(values_len + 1): 
            for w in range(max_weight + 1): 
                if i == 0 or w == 0: 
                    knap[i][w] = 0
                    continue
                elif weights[i-1] <= w: 
                    knap[i][w] = max(
                        values[i-1] + knap[i-1][w-weights[i-1]],   
                        knap[i-1][w]
                    ) 
                    continue
                knap[i][w] = knap[i-1][w] 
        return knap[values_len][max_weight]
