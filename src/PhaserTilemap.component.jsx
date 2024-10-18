import React, { useState, useEffect } from "react";

import { useScene } from "./PhaserScene.component";







// const map = scene.make.tilemap({ data: level, tileWidth: 32, tileHeight: 32 });
// const tileset = map.addTilesetImage('tiles');





// https://rexrainbow.github.io/phaser3-rex-notes/docs/site/tilemap/

// var sprites = map.createFromTiles(indexes, replacements, spriteConfig);
// map.setBaseTileSize(tileWidth, tileHeight);
// var tileXY = map.worldToTileXY(worldX, worldY);
// var hasTile = map.hasTileAtWorldXY(worldX, worldY);

// var layer = map.getLayer(name);
// map.setLayer(layer);  // layer name, layer index
// layer.setRenderOrder(renderOrder);

// map.fill(index);  // Fill all grids
// or
// map.fill(index, tileX, tileY, width, height);

// Randomize current layer
// map.randomize(); // Randomize all grids
// or
// map.randomize(tileX, tileY, width, height, indexes);

// Randomize layer
// layer.randomize();  // Randomize all grids
// or
// layer.randomize(tileX, tileY, width, height, indexes);

// Weight randomize layer
// layer.weightedRandomize(
//     {
//         { index: 0, weight: 4 },
//         { index: [0, 1], weight: 4 }
//     },
//     tileX, tileY, width, height);


// Copy tiles¶
// Copy current layer
// map.copy(srcTileX, srcTileY, width, height, destTileX, destTileY);
// Copy layer
// map.copy(srcTileX, srcTileY, width, height, destTileX, destTileY, recalculateFaces, layer);
// or
// layer.copy(srcTileX, srcTileY, width, height, destTileX, destTileY, recalculateFaces);


// Put on current layer
// map.putTileAt(tile, tileX, tileY);


// var tile = map.getTileAt(tileX, tileY);
// or
// var tile = map.getTileAtWorldXY(worldX, worldY);

// Put on layer
// map.putTileAt(tile, tileX, tileY, recalculateFaces, layer);
// or
// layer.putTileAt(tile, tileX, tileY, recalculateFaces);

// Put tiles at¶
// Put on current layer
// map.putTilesAt(tilesArray, tileX, tileY);  // tilesArray: 1d/2d array of Tile object or tile index
// tilesArray : 1d/2d array of tile objects or tile indexes
// Put on layer
// map.putTilesAt(tilesArray, tileX, tileY, recalculateFaces, layer);
// or
// layer.putTilesAt(tilesArray, tileX, tileY, recalculateFaces);


// Replace tiles¶
// Replace on current layer
// map.replaceByIndex(findIndex, newIndex); // Search on all grids
// or
// map.replaceByIndex(findIndex, newIndex, tileX, tileY, width, height);
// Replace on layer
// map.replaceByIndex(findIndex, newIndex, tileX, tileY, width, height, layer);
// or
// layer.replaceByIndex(findIndex, newIndex, tileX, tileY, width, height);



// map.weightedRandomize(
//     {
//         { index: 0, weight: 4 },
//         { index: [0, 1], weight: 4 }
//     },
//     tileX, tileY, width, height);

// var sprites = map.createFromObjects(layerName, {
//     // gid: 26,
//     // name: 'bonus',
//     // id: 9,

//     // classType: Sprite,
//     // ignoreTileset
//     // scene,
//     // container: null,
//     // key: null,
//     // frame: null
// }, useTileset);

// var layer = map.createBlankLayer(layerID, tileset);

// var tileset = map.addTilesetImage(tilesetName, key); // key: texture key

export default function PhaserTilemap({
    data,
    tileWidth,
    tileHeight,
    layer,
    position,
    image
}){

    const scene = useScene();
    const [ tilemap, setTilemap  ] = useState(null);
    

    useEffect( () => { // Welcome Tilemap

        

        function createTilemap(){




            const imageName = typeof image === "string" ? image : image.name;
            const map       = scene.make.tilemap({ data, tileWidth, tileHeight });
            const tileset   = map.addTilesetImage(imageName);
            const tileLayer = map.createLayer(undefined, tileset, position.x, position.y );


            console.log("TILEMAP CREATED", {
                imageName, data, tileWidth, tileHeight, tileLayer
            });

            setTilemap(map);
        }


        if( typeof image === "string" ) createTilemap()
        else scene.loadAssets({ images: { [image.name]: image.url } }, true)
            .catch( e => console.error(e))
            .then( createTilemap );

        return () => { // Goodbye Tilemap

        };
    }, []);
    
    return null;
}