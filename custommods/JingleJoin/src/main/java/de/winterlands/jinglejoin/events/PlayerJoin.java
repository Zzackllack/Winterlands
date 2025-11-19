package de.winterlands.jinglejoin.events;

import de.winterlands.jinglejoin.sounds.ModSounds;
import net.minecraft.world.entity.player.Player;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.neoforge.client.event.ClientPlayerNetworkEvent;

public class PlayerJoin {
    @SubscribeEvent
    public static void onPlayerJoin(ClientPlayerNetworkEvent.LoggingIn event) {
        Player player = event.getPlayer();

        player.playSound(ModSounds.getRandomSound().value(), 1.0f, 1.0f);


    }
}
